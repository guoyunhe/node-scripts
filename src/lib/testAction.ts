import { run } from 'jest';

export function testAction() {
  run(process.argv.slice(3));
}
