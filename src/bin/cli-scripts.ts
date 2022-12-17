#!/usr/bin/env node

import { Command } from 'commander';
import { buildAction, lintAction, testAction } from '..';

const program = new Command('node-scripts');

program
  .command('build')
  .description('Build command line tools and library exports')
  .option(
    '--watch',
    'Watch source code change and rebuild automatically, same as node-scripts watch'
  )
  .action(buildAction);

program
  .command('watch')
  .description(
    'Watch source code change and rebuild automatically, same as node-scripts build --watch'
  )
  .action(() => buildAction({ watch: true }));

program
  .command('lint')
  .description('Check lint problems with ESLint')
  .option('--fix', 'Fix lint problems automatically')
  .action(lintAction);

program
  .command('format')
  .description('Format source code with Prettier and fix ESLint issues')
  .action(() => lintAction({ fix: true }));

program
  .command('test')
  .allowUnknownOption()
  .description('Run unit tests (same with Jest API)')
  .action(testAction);

program.helpOption('-h, --help', 'Show full help');
program.addHelpCommand('help [command]', 'Show help of a command');

declare const PACKAGE_VERSION: string;
if (typeof PACKAGE_VERSION === 'string') {
  program.version(PACKAGE_VERSION, '-v, --version', 'Show version number');
}

program.parse();
