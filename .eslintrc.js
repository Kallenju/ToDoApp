module.exports = {
  env: {
    browser: true,
    node: true,
  },
  plugins: ['prettier'],
  extends: ['eslint:recommended', 'airbnb-base', 'prettier'],
  parser: '@babel/eslint-parser',
  parserOptions: {
    requireConfigFile: false,
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'no-param-reassign': 0,
    'import/extensions': [
      1,
      {
        js: 'always',
      },
    ],
    'import/prefer-default-export': 'off',
    'import/no-default-export': 'error',
    'prettier/prettier': 'error',
  },
};
