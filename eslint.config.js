import { configApp } from '@adonisjs/eslint-config'

export default [
  ...configApp(),
  {
    rules: {
      'unicorn/filename-case': [
        'error',
        {
          cases: {
            camelCase: true,
            pascalCase: true,
          },
        },
      ],
    },
  },
]
