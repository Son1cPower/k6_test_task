import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';
import eslintConfigPrettier from 'eslint-config-prettier';
import prettier from 'eslint-plugin-prettier';

export default defineConfig([
  globalIgnores(['node_modules/**', 'dist/**', 'screenshots*/**', '**/*.js']),

  // k6 TypeScript sources
  {
    files: ['**/*.{ts,mts,cts}'],
    extends: [js.configs.recommended, tseslint.configs.recommended, eslintConfigPrettier],
    plugins: {
      prettier,
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        projectService: true,
      },
      globals: {
        // k6 runtime globals (injected by the k6 engine)
        __ENV: 'readonly',
        __VU: 'readonly',
        __ITER: 'readonly',
      },
    },
    rules: {
      'prettier/prettier': 'warn',
      'no-console': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', ignoreRestSiblings: true },
      ],
    },
  },
]);
