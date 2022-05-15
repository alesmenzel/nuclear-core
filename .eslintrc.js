const EXTENSIONS = ['.js', '.ts'];

module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'airbnb-base',
    'plugin:@typescript-eslint/recommended',
    'plugin:jest/recommended',
    'plugin:promise/recommended',
    'plugin:prettier/recommended',
  ],
  plugins: ['@typescript-eslint'],
  settings: {
    'import/extensions': EXTENSIONS,
    'import/parsers': {
      '@typescript-eslint/parser': EXTENSIONS,
    },
    'import/resolver': {
      typescript: {
        project: './tsconfig.json',
      },
      node: {
        extensions: EXTENSIONS,
      },
    },
  },
  rules: {
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        ts: 'never',
      },
    ],
    'no-underscore-dangle': 'off',
    'no-shadow': 'off',
    'no-param-reassign': 'off',
  },
  overrides: [
    {
      files: './src/**/*.test.ts',
      rules: {
        'import/no-extraneous-dependencies': 'off',
        'max-classes-per-file': 'off',
      },
    },
  ],
};
