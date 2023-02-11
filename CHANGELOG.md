# Changelog

## 2.0.1 - 2023-02-11

- Fixed exception when here is no `src/index.ts`

## 2.0.0 - 2023-02-11

- **BREAKING CHANGE**: Changed output file paths
  - dist/cjs/index.js -> dist/index.js
  - dist/cjs/bin/my-cli.js -> dist/my-cli.js
  - dist/esm/index.js -> dist/index.mjs
  - dist/esm/bin/my-cli.js -> (deleted)
  - dist/dts/index.d.ts -> dist/index.d.ts
- Updated `commander` from 9.x to 10.x
- Added `PACKAGE_NAME` global definition

## 1.9.0 - 2023-01-30

- Refactored `build` action

## 1.8.0 - 2023-01-30

- Refactored `lint` and `test` actions

## 1.7.1 - 2023-01-26

- Fixed `package.json` spaces

## 1.7.0 - 2023-01-26

- Formatted `package.json`

## 1.6.0 - 2023-01-22

- Updated `esbuild` from 0.16.x to 0.17.x

## 1.5.1 - 2023-01-22

- Fixed build bundle size by external `devDependencies` and `peerDependencies`

## 1.5.0 - 2022-12-17

- Added TypeScript declartion (.d.ts) output

## 1.4.0 - 2022-12-13

- Changed lint config package name

## 1.3.0 - 2022-12-13

- Added `build --watch` option
- Added `watch` command, same as `build --watch`

## 1.2.0 - 2022-12-12

- Added tsconfig `target` support

## 1.1.3 - 2022-12-11

- Fixed bin scripts

## 1.1.2 - 2022-12-11

- Fixed bin scripts

## 1.1.1 - 2022-12-11

- Fixed `ts-jest` dependency

## 1.1.0 - 2022-12-11

- Added Jest preset

## 1.0.1 - 2022-12-11

- Fixed `build` bundle

## 1.0.0 - 2022-12-11

- Added `build` command
- Added `format` command
- Added `lint` command
- Added `test` command
