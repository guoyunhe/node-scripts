import { build } from 'esbuild';
import glob from 'fast-glob';
import { rm, readJSON } from 'fs-extra';
import { join } from 'path';
import { builtinModules } from 'module';

export async function buildAction() {
  const packageJson = (await readJSON('package.json', { throws: false })) || {};
  const define = {
    PACKAGE_VERSION: '"' + packageJson.version + '"',
  };
  const external: string[] = [
    ...Object.keys(packageJson.dependencies || {}),
    ...Object.keys(packageJson.peerDpendencies || {}),
    ...builtinModules,
    ...builtinModules.map((mod) => 'node:' + mod),
  ];
  const entryPoints = await glob([
    join('src', 'bin', '*.ts'),
    join('src', 'index.ts'),
  ]);
  await rm('dist', { force: true, recursive: true });
  await Promise.all([
    build({
      entryPoints,
      format: 'cjs',
      outdir: join('dist', 'cjs'),
      bundle: true,
      define,
      external,
    }),
    build({
      entryPoints,
      format: 'esm',
      outdir: join('dist', 'esm'),
      bundle: true,
      define,
      external,
    }),
  ]);
}
