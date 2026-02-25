module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module'
  },
  extends: ['eslint:recommended'],
  plugins: [],
  rules: {
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    semi: ['error', 'never'],
    quotes: ['error', 'single']
  },
  overrides: [
    // TypeScript 文件配置
    {
      files: ['*.ts', '*.tsx'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'module',
        project: './tsconfig.json'
      },
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended'
      ],
      plugins: ['@typescript-eslint'],
      rules: {
        '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
        '@typescript-eslint/no-explicit-any': 'warn',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-non-null-assertion': 'warn',
        'no-unused-vars': 'off' // 关闭 ESLint 的，使用 TypeScript 的
      }
    },
    // Vue 文件配置
    {
      files: ['*.vue'],
      parser: 'vue-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser',
        sourceType: 'module',
        ecmaVersion: 2021
      },
      extends: [
        'eslint:recommended',
        'plugin:vue/vue3-recommended',
        'plugin:@typescript-eslint/recommended'
      ],
      plugins: ['@typescript-eslint'],
      rules: {
        // 视图文件名多为 index.vue，关闭多单词组件名限制
        'vue/multi-word-component-names': 'off',
        // 组件化开发相关规则
        'vue/max-attributes-per-line': [
          'warn',
          {
            singleline: 3,
            multiline: 1
          }
        ],
        'vue/component-name-in-template-casing': [
          'warn',
          'PascalCase',
          {
            ignores: ['router-view', 'router-link', 'keep-alive']
          }
        ],
        'vue/attribute-hyphenation': ['warn', 'always'],
        'vue/v-on-event-hyphenation': ['warn', 'always'],
        // TypeScript 相关规则
        '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
        '@typescript-eslint/no-explicit-any': 'warn',
        'no-unused-vars': 'off'
      }
    }
  ]
}

