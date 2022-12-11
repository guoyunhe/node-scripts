import esbuild from 'esbuild';
import glob from 'fast-glob';
import { rm } from 'fs/promises';
import { join } from 'path';

export async function build() {
  const entryPoints = await glob([
    join('src', 'bin', '*.ts'),
    join('src', 'index.ts'),
  ]);
  await rm('dist', { force: true, recursive: true });
  esbuild.build({
    entryPoints,
    format: 'cjs',
    outdir: join('dist', 'cjs'),
  });
  esbuild.build({
    entryPoints,
    format: 'esm',
    outdir: join('dist', 'esm'),
  });
}
