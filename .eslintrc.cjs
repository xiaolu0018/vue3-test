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
    parser: '@typescript-eslint/parser'
  },
  rules: {
    'vue/multi-word-component-names': 'off', // 允许单文件组件名[5](@ref)
    'prettier/prettier': ['error', { singleQuote: true, htmlWhitespaceSensitivity: 'ignore' }], // 强制单引号[7](@ref)
    'vue/html-closing-bracket-newline': ['error', { multiline: 'never' }]
  }
}
