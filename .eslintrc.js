module.exports = {
  env: {
    es2021: true,
    node: true,
    jest: true,
  },
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'eslint-config-prettier',
  ],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/camelcase': 'off',
    'import/prefer-default-export': 'off',
    'class-methods-use-this': 'off',
    'no-useless-constructor': 'off',
  },
};
