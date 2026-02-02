import js from '@eslint/js';
import nextPlugin from '@next/eslint-plugin-next';
import erasableSyntaxOnly from 'eslint-plugin-erasable-syntax-only';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import reactRefreshPlugin from 'eslint-plugin-react-refresh';
import simpleImportSortPlugin from 'eslint-plugin-simple-import-sort';
import unusedImportsPlugin from 'eslint-plugin-unused-imports';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  // Ignore patterns
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'dist/**',
      'build/**',
    ],
  },

  // Base ESLint recommended
  js.configs.recommended,

  // TypeScript ESLint recommended
  ...tseslint.configs.recommended,

  // Additional plugin configuration
  erasableSyntaxOnly.configs.recommended,

  // Main configuration
  {
    files: ['**/*.{js,mjs,cjs,jsx,ts,tsx}'],
    plugins: {
      '@next/next': nextPlugin,
      'react': reactPlugin,
      'react-hooks': reactHooksPlugin,
      'jsx-a11y': jsxA11yPlugin,
      'react-refresh': reactRefreshPlugin,
      'simple-import-sort': simpleImportSortPlugin,
      'unused-imports': unusedImportsPlugin,
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: tseslint.parser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.es2024,
        ...globals.node,
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
      'import/ignore': ['class-variance-authority'],
    },
    rules: {
      // Next.js rules
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,

      // React rules
      ...reactPlugin.configs.recommended.rules,
      ...reactPlugin.configs['jsx-runtime'].rules,
      'react/jsx-filename-extension': [
        2,
        { extensions: ['.js', '.jsx', '.tsx', '.ts'] },
      ],
      'react/jsx-props-no-spreading': 'off',
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',

      // React Hooks rules
      ...reactHooksPlugin.configs.recommended.rules,

      // JSX a11y rules
      ...jsxA11yPlugin.configs.recommended.rules,

      // TypeScript rules
      '@typescript-eslint/consistent-type-imports': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { 
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],

      // General rules
      'no-await-in-loop': 'off',
      'no-restricted-syntax': 'off',
      'no-unused-vars': 'off',

      // React Refresh rules
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],

      // Import sorting rules - THESE ARE CRITICAL FOR YOUR ISSUE
      'simple-import-sort/exports': 'error',
      'simple-import-sort/imports': 'error',

      // Unused imports rules - THESE ARE CRITICAL FOR YOUR ISSUE
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
    },
  },
);
