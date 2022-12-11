/** @type {import('jest').Config} */
const config = {
  collectCoverage: true,
  collectCoverageFrom: [
    '<rootDir>/src/**/*.{js,ts}',
    '!<rootDir>/src/**/*.d.ts',
  ],
  coveragePathIgnorePatterns: [
    '/build/',
    '/dist/',
    '/coverage/',
    '/node_modules/',
  ],
  coverageReporters: ['html', 'json-summary', 'text'],
  moduleNameMapper: {
    'lodash-es': 'lodash',
    'fetch-mock/esm/client': 'fetch-mock/cjs/client',
  },
  testEnvironment: 'node',
  transform: { '^.+\\.[tj]sx?$': 'ts-jest' },
};

export default config;
