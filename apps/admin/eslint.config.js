import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import unusedImports from 'eslint-plugin-unused-imports';

export default tseslint.config(
  { ignores: ['dist/**'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  { files: ['src/**/*.{ts,tsx}', 'vite.config.ts'], languageOptions: { globals: { ...globals.browser, ...globals.node } }, plugins: { 'unused-imports': unusedImports }, rules: { 'unused-imports/no-unused-imports': 'error', '@typescript-eslint/no-explicit-any': 'error' } },
);
