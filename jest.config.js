/* eslint-disable no-undef */

module.exports = {
    clearMocks: true,
    coverageDirectory: 'coverage',
    coveragePathIgnorePatterns: ['\\\\node_modules\\\\'],
    coverageProvider: 'v8',
    testEnvironment: 'jsdom',
    globals: {
      'handlebars-jest': {
        helperDirs: [
          '<rootDir>/src/app/components/header/template/',
          '<rootDir>/src/app/components/modal/template/',
          '<rootDir>/src/app/pages/settings/template/',
          '<rootDir>/src/app/pages/tasks-list/task/template/',
          '<rootDir>/src/app/pages/timer/template/',
        ],
        partialDirs: [
          '<rootDir>/src/app/components/header/template',
          '<rootDir>/src/app/components/tab/template',
        ],
        partialExtensions: ['.hbs', '.html'],
      },
    },
    moduleNameMapper: {
      '\\.(css|less|scss|sss|styl)$': '<rootDir>/node_modules/jest-css-modules',
    },
  
    setupFiles: ['./test-env.js'],
    testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[tj]s?(x)'],
    testPathIgnorePatterns: ['\\\\node_modules\\\\'],
    testURL: 'http://localhost:3000',
    transform: {
      '\\.[jt]sx?$': 'babel-jest',
      '^.+\\.hbs$': './node_modules/handlebars-jest',
    },
    transformIgnorePatterns: ['\\\\node_modules\\\\', '\\.pnp\\.[^\\\\]+$'],
  };
  