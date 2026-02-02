import { FlatCompat } from '@eslint/eslintrc';
import erasableSyntaxOnly from 'eslint-plugin-erasable-syntax-only';
import reactRefreshPlugin from 'eslint-plugin-react-refresh';
import simpleImportSortPlugin from 'eslint-plugin-simple-import-sort';
import unusedImportsPlugin from 'eslint-plugin-unused-imports';
import globals from 'globals';
import { dirname } from 'path';
import tseslint from 'typescript-eslint';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default tseslint.config(
  // Next.js configurations (includes React, React Hooks, ESLint recommended, TypeScript, Import plugin)
  ...compat.extends('next/core-web-vitals', 'next/typescript'),

  // Additional plugin configurations not included in Next.js
  erasableSyntaxOnly.configs.recommended,

  // File patterns
  {
    files: ['src/**/*.{js,jsx,ts,tsx}'],
  },

  // Ignore patterns
  {
    ignores: [
      'node_modules',
      '.next',
      'out',
    ],
  },

  // Language options
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2024,
        ...globals.node,
      },
    },
  },

  // Additional plugins not included in Next.js
  {
    plugins: {
      'react-refresh': reactRefreshPlugin,
      'simple-import-sort': simpleImportSortPlugin,
      'unused-imports': unusedImportsPlugin,
    },
  },

  // Settings
  {
    settings: {
      'import/ignore': ['class-variance-authority'],
    },
  },

  // Custom rules
  {
    rules: {
      // TypeScript rules
      '@typescript-eslint/consistent-type-imports': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-implicit-any': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],

      // Import rules (leveraging Next.js's import plugin)
      'import/default': 'off',
      'import/named': 'off',
      'import/namespace': 'off',
      'import/no-named-as-default-member': 'off',
      'import/no-unresolved': 'off',

      // General rules
      'no-await-in-loop': 'off',
      'no-restricted-syntax': 'off',
      'no-unused-vars': 'off',

      // React Refresh rules
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

      // React rules (leveraging Next.js's React plugin)
      'react/jsx-filename-extension': [2, { extensions: ['.js', '.jsx', '.tsx', '.ts'] }],
      'react/jsx-props-no-spreading': 'off',
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',

      // Import sorting rules
      'simple-import-sort/exports': 'error',
      'simple-import-sort/imports': 'error',

      // Unused imports rules
      'unused-imports/no-unused-imports': 'error',
    },
  },
);
