import { build as esbuild } from 'esbuild';
import glob from 'fast-glob';
import { rm } from 'fs/promises';
import { join } from 'path';

export async function buildAction() {
  const entryPoints = await glob([
    join('src', 'bin', '*.ts'),
    join('src', 'index.ts'),
  ]);
  await rm('dist', { force: true, recursive: true });
  await Promise.all([
    esbuild({
      entryPoints,
      format: 'cjs',
      outdir: join('dist', 'cjs'),
    }),
    esbuild({
      entryPoints,
      format: 'esm',
      outdir: join('dist', 'esm'),
    }),
  ]);
}
