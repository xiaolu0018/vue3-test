module.exports = {
  root: true,
  env: { node: true, browser: true },
  extends: [
    './.eslintrc-auto-import.json',
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    '@vue/eslint-config-typescript',
    'plugin:prettier/recommended' // 必须放在最后以覆盖冲突规则[12](@ref)
  ],
  plugins: ['vue', '@typescript-eslint'],
  parserOptions: {
    ecmaVersion: 2022,
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
  },
  rules: {
    'vue/multi-word-component-names': 'off', // 允许单文件组件名[5](@ref)
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        semi: false,
        htmlWhitespaceSensitivity: 'ignore',
        trailingComma: 'none',
        endOfLine: 'auto'
      }
    ], // 强制单引号[7](@ref)
    'vue/html-closing-bracket-newline': ['error', { multiline: 'never' }],
    // 关闭与 Prettier 冲突的规则
    'arrow-body-style': 'off',
    'prefer-arrow-callback': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off'
  },
  // 新增：解决 Vue 文件中 TypeScript 解析问题
  settings: {
    'import/resolver': {
      typescript: {},
      node: true
    },
    vue: {
      version: '3.x'
    }
  },
  ignorePatterns: [
    '.eslintrc.cjs',
    'node_modules/',
    'dist/',
    'public/',
    'src/assets/*',
    'script.js',
    'dist.zip'
  ]
}
