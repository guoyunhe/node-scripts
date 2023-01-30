import { bundleDts } from '@guoyunhe/bundle-dts';
import { build, BuildOptions, context } from 'esbuild';
import glob from 'fast-glob';
import { readJSON, rm } from 'fs-extra';
import { join } from 'path';

export interface BuildActionOptions {
  watch: boolean;
}

export async function buildNode({ watch }: BuildActionOptions) {
  const packageJson = (await readJSON('package.json', { throws: false })) || {};
  const define = {
    PACKAGE_VERSION: `"${packageJson.version}"`,
  };
  const entryPoints = await glob([join('src', 'bin', '*.ts'), join('src', 'index.ts')]);
  const commonOptions: BuildOptions = {
    entryPoints,
    bundle: true,
    define,
    packages: 'external',
    platform: 'node',
    write: true,
  };
  await rm('dist', { force: true, recursive: true });

  async function buildJs(format: 'cjs' | 'esm') {
    const buildOptions: BuildOptions = {
      ...commonOptions,
      format,
      outdir: join('dist', format),
    };
    if (watch) {
      const ctx = await context(buildOptions);
      await ctx.watch({});
    } else {
      await build(buildOptions);
    }
  }

  await Promise.all([
    buildJs('cjs'),
    buildJs('esm'),
    bundleDts({ outFile: join('dist', 'dts', 'index.d.ts') }),
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
