import {
  Extractor,
  ExtractorConfig,
  IExtractorConfigPrepareOptions,
} from '@microsoft/api-extractor';
import glob from 'fast-glob';
import { pathExists, readJSON, rm } from 'fs-extra';
import { join } from 'path';
import {
  CompilerOptions,
  convertCompilerOptionsFromJson,
  createProgram,
} from 'typescript';

/**
 * Build TypeScript declaration files and bundle them into one
 * @see https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API
 * @see https://api-extractor.com/pages/setup/configure_rollup/
 */
export async function bundleDeclaration() {
  // Create a temp directory for intermediate files
  const dtsTempDir = join(process.cwd(), 'dist', 'dts-raw');
  const dtsTempEntry = join(dtsTempDir, 'index.d.ts');
  const tsconfigJsonPath = join(process.cwd(), 'tsconfig.json');
  if (!(await pathExists(tsconfigJsonPath))) return;
  const tsconfig = (await readJSON(tsconfigJsonPath, { throws: false })) || {};
  const compilerOptionsResult = convertCompilerOptionsFromJson(
    tsconfig,
    process.cwd()
  );
  const compilerOptions: CompilerOptions = {
    ...compilerOptionsResult.options,
    declaration: true,
    emitDeclarationOnly: true,
    outDir: dtsTempDir,
  };

  const fileNames = await glob(['src/**/*.ts'], {
    ignore: ['*.test.ts', '*.spec.ts', '*.test.tsx', '*.spec.tsx'],
  });

  // Prepare and emit the d.ts files
  const program = createProgram(fileNames, compilerOptions);
  program.emit();

  // Bundle d.ts files
  const extractorOptions: IExtractorConfigPrepareOptions = {
    configObjectFullPath: join(process.cwd(), 'api-extractor.json'),
    packageJsonFullPath: join(process.cwd(), 'package.json'),
    configObject: {
      mainEntryPointFilePath: dtsTempEntry,
      projectFolder: process.cwd(),
      compiler: {
        tsconfigFilePath: tsconfigJsonPath,
      },
      dtsRollup: {
        enabled: true,
        untrimmedFilePath: join('dist', 'dts', 'index.d.ts'),
      },
    },
  };
  const extractorConfig = ExtractorConfig.prepare(extractorOptions);
  const extractorResult = Extractor.invoke(extractorConfig);
  if (extractorResult.succeeded) {
    await rm(dtsTempDir, { recursive: true, force: true });
  } else {
    throw 'failed';
  }
}
