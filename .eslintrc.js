module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: [
    'airbnb-base',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
  ],
  rules: {
    'no-useless-constructor': 'off',
    '@typescript-eslint/no-useless-constructor': ['error'],
    'no-unused-vars': 'off',
    'import/no-unresolved': 'off',
    'import/prefer-default-export': 'off',
    'import/extensions': 'off',
    'no-empty-function': 'off',
    'no-underscore-dangle': 'off',
    'no-undef': 'off',
    'class-methods-use-this': 'off',
    'no-return-await': 'off',
    'consistent-return': 'off',
    'no-param-reassign': 'off',
    'no-shadow': 'off',
    'no-console': 'off',
    camelcase: 'off',
  },
};
