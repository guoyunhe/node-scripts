#!/usr/bin/env node

import { Command } from 'commander';
import { build, lint, test } from '..';

const program = new Command('cli-scripts');

program
  .command('build')
  .description('Build command line tools and library exports')
  .action(build);

program
  .command('lint')
  .description('Check lint problems with ESLint and Stylelint')
  .option('--fix', 'Fix lint problems automatically')
  .option('--staged', 'Lint git staged files')
  .action(lint);

program
  .command('test')
  .allowUnknownOption()
  .description('Run unit tests (same with Jest API)')
  .action(test);

program.helpOption('-h, --help', 'Show full help');
program.addHelpCommand('help [command]', 'Show help of a command');

declare const PACKAGE_VERSION: string;
if (typeof PACKAGE_VERSION === 'string') {
  program.version(PACKAGE_VERSION, '-v, --version', 'Show version number');
}

program.parse();
