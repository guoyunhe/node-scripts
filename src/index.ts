import { bundleDts } from '@guoyunhe/bundle-dts';
import { build, BuildOptions, context } from 'esbuild';
import glob from 'fast-glob';
import { readFile, rm } from 'fs/promises';
import { join } from 'path';

export interface BuildActionOptions {
  watch: boolean;
}

export async function buildNode({ watch }: BuildActionOptions) {
  const packageJson = JSON.parse(await readFile('package.json', 'utf-8'));
  const define = {
    PACKAGE_NAME: `"${packageJson.name}"`,
    PACKAGE_VERSION: `"${packageJson.version}"`,
  };
  const commonOptions: BuildOptions = {
    entryPoints: ['src/index.ts'],
    bundle: true,
    define,
    packages: 'external',
    platform: 'node',
    write: true,
    outdir: 'dist',
  };

  await rm('dist', { force: true, recursive: true });

  async function buildAndWatch(options: BuildOptions) {
    const buildOptions: BuildOptions = {
      ...commonOptions,
      ...options,
    };
    if (watch) {
      const ctx = await context(buildOptions);
      await ctx.watch({});
    } else {
      await build(buildOptions);
    }
  }

  const binEntryPoints = await glob('src/bin/*.ts', { ignore: ['*.{spec,test}.ts'] });

  await Promise.all([
    // Build bin scripts
    buildAndWatch({ format: 'cjs', entryPoints: binEntryPoints }),
    // Build CJS output
    buildAndWatch({ format: 'cjs' }),
    // Build ESM output
    buildAndWatch({ format: 'esm', outExtension: { '.js': '.mjs' } }),
    // Build *.d.ts output, watch mode is not supported yet
    bundleDts({ outFile: join('dist', 'index.d.ts') }),
  ]);

  if (watch) {
    console.log('watching, press q to quit...');
    // without this, we would only get streams once enter is pressed
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.on('data', function (key) {
      // press q to quit
      if (key.toString('utf-8') === 'q') {
        process.exit();
      }
    });
  }
}
