import { ESLint } from 'eslint';
import { outputJSON, readFile, readJSON, writeFile } from 'fs-extra';
import sortPackageJson from 'sort-package-json';
import glob from 'fast-glob';
import { resolveConfig as prettierResolveConfig, format as prettierFormat } from 'prettier';

export interface LintActionOptions {
  fix?: boolean;
}

export async function lintAction({ fix }: LintActionOptions) {
  const packageJson = (await readJSON('package.json', { throws: false })) || {};

  if (fix) {
    // Format source code with Prettier
    const files = await glob('src/**/*.{js,jsx,ts,tsx}');
    await Promise.all(
      files.map(async (filePath: string) => {
        const text = await readFile(filePath, 'utf8');
        const options = await prettierResolveConfig(filePath);
        const formatted = prettierFormat(text, {
          ...options,
          filepath: filePath,
        });
        if (formatted !== text) {
          await writeFile(filePath, formatted, 'utf8');
          console.log(`Formatted: ${filePath}`);
        }
      })
    );
    // Format package.json
    await outputJSON('package.json', sortPackageJson(packageJson), {
      spaces: 2,
    });
  }

  // Create ESLint instance and load configuration
  const eslint = new ESLint({
    fix,
    baseConfig: packageJson.eslintConfig,
  });

  // Lint files
  const results = await eslint.lintFiles('src/**/*.{js,jsx,ts,tsx}');

  // Fix lint issues and save changes, if needed
  if (fix) {
    await ESLint.outputFixes(results);
  }

  // Format results and output to console
  const formatter = await eslint.loadFormatter('stylish');
  const resultText = await formatter.format(results);
  console.log(resultText);

  if (ESLint.getErrorResults(results).length > 0) {
    process.exitCode = 1;
  }
}
