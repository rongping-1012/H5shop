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
    {
      files: ['*.vue'],
      parser: 'vue-eslint-parser',
      parserOptions: {
        parser: '@babel/eslint-parser',
        sourceType: 'module',
        requireConfigFile: false
      },
      extends: ['plugin:vue/vue3-recommended'],
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
        'vue/v-on-event-hyphenation': ['warn', 'always']
      }
    }
  ]
}


