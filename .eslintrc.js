module.exports = {
  env: {
    browser: true,
    es2021: true,
    es6: true,
    jquery: true,
    "jest": true,
  },
  extends: 'eslint:recommended',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    semi: ['error', 'always'],
    quotes: ['error', 'single'],
  },
};
