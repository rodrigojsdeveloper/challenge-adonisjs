import { configApp } from '@adonisjs/eslint-config'
import unicorn from 'eslint-plugin-unicorn'
import prettier from 'eslint-plugin-prettier'

export default [
  ...configApp(),
  {
    plugins: {
      unicorn,
      prettier,
    },
    rules: {
      quotes: ['error', 'double', { avoidEscape: true }],
      semi: ['error', 'always'],
      'prettier/prettier': [
        'error',
        {
          singleQuote: false,
          semi: true,
        },
      ],
      "stuff/filename-case": [
        "error",
        {
          "case": "camelCase",
          "case": "PascalCase",
        }
      ],
    },
  },
]
