import tseslint from 'typescript-eslint'
import baseConfig from '../../eslint.config.js'

export default tseslint.config(
  ...baseConfig,
  {
    // Source files
    files: ['src/**/*.ts'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
    },
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'error',
    },
  },
  {
    // Config files and scripts
    files: ['*.config.ts', 'scripts/**/*.ts'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.eslint.json',
      },
    },
  },
)
