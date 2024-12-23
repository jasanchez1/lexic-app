import js from '@eslint/js'
import prettier from 'eslint-config-prettier'
import { defineFlatConfig } from 'eslint-define-config'
import vue from 'eslint-plugin-vue'
import typescript from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import * as vueParser from 'vue-eslint-parser'
import globals from 'globals'

export default defineFlatConfig([
  {
    ignores: ['.nuxt/**', 'dist/**', 'node_modules/**', '.output/**', '.git/**']
  },
  js.configs.recommended,
  prettier,
  {
    files: ['**/*.vue'],
    plugins: {
      vue,
      '@typescript-eslint': typescript
    },
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tsParser,
        extraFileExtensions: ['.vue'],
        ecmaFeatures: {
          jsx: true
        }
      },
      globals: {
        ...globals.node,
        definePageMeta: 'readonly',
        useRuntimeConfig: 'readonly',
        useRoute: 'readonly',
        useRouter: 'readonly',
        ref: 'readonly',
        computed: 'readonly'
      }
    },
    rules: {
      ...vue.configs.recommended.rules,
      'vue/multi-word-component-names': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-empty-interface': [
        'error',
        {
          allowSingleExtends: true
        }
      ]
    }
  },
  {
    files: ['**/*.ts', '**/*.tsx', 'nuxt.config.ts'],
    plugins: {
      '@typescript-eslint': typescript
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json'
      },
      globals: {
        ...globals.node,
        defineNuxtConfig: 'readonly'
      }
    },
    rules: {
      ...typescript.configs.recommended.rules,
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-empty-interface': [
        'error',
        {
          allowSingleExtends: true
        }
      ]
    }
  },
  {
    files: ['**/*.{js,jsx,mjs,cjs,ts,tsx,vue}'],
    plugins: {
      '@typescript-eslint': typescript
    },
    rules: {
      semi: ['error', 'never'],
      quotes: ['error', 'single']
    }
  }
])
