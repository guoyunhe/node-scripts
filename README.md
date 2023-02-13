# @guoyunhe/node-scripts

Scripts to build, lint and test Node.js projects.

Features:

- Minimum configuration, easy to use
- Lightning fast build speed, powered by esbuild
- Full TypeScript support in build, lint and test
- Ensure good coding style by ESLint and Prettier
- Out of box unit test support, powered by Jest

## Create projects

Create a node project:

```
npm create @guoyunhe/node my-package
```

Create a CLI project:

```
npm create @guoyunhe/cli my-package
```

## Options

### --help

Show help.

### --version

Show version.

## Commands

### build

Build CJS, ESM and TypeScript declaration (\*.d.ts).

```
node-scripts build
```

CJS and ESM builds are powered by esbuild, one of the fastest JavaScript complier and bundler.
TypeScript declarations are generated by TypeScript and bundled by API Extractor from Microsoft.

The build command read entry `src/index.ts`. CJS is output at `dist/index.js`. ESM is output at
`dist/index.mjs`. Declaration is output at `dist/index.d.ts`.

For CLI projects, it scans `src/bin/*.ts`. For example, `src/bin/my-cli.ts` outputs `dist/my-cli.js`
(CJS) and `dist/my-cli.mjs` (ESM).

Support watch mode with `--watch` option.

```
node-scripts build --watch
```

### watch

Watch mode. Same as `node-scripts build --watch`.

```
node-scripts watch
```

### lint

```
node-scripts format
```

Check your code with ESLint.

Support auto fix code issues with `--fix` option. (This will also run Prettier for formatting)

```
node-scripts lint --fix
```

### format

Format code and fix ESLint issues. Same as `node-scripts lint --fix`.

```
node-scripts format
```

### format

Format code and fix ESLint issues. Same as `node-scripts lint --fix`.

```
node-scripts format
```

### test

Run unit tests with Jest. Generate coverage report at `coverage`.

```
node-scripts test
```

Support all [Jest CLI options](https://jestjs.io/docs/cli). For example:

```bash
# Watch mode
node-scripts test --watchAll

# Update snapshots
node-scripts test -u
```
