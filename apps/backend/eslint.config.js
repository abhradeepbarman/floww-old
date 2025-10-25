import { config } from '@repo/eslint-config/base';

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...config,
  {
    languageOptions: {
      globals: {
        process: 'readonly',
        __dirname: 'readonly',
        module: 'readonly',
        require: 'readonly',
        console: 'readonly',
      },
      sourceType: 'module',
      ecmaVersion: 'latest',
    },
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
    rules: {
      'no-console': 'off', // allow console logs in backend
      'no-var': 'error', // enforce let/const
      'prefer-const': 'warn',
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-undef': 'error',
      '@typescript-eslint/no-explicit-any': 'off',
    },
    ignores: ['node_modules/**', 'dist/**', 'build/**', '.turbo/**', 'coverage/**'],
  },
];
