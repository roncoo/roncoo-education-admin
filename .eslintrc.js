module.exports = {
    root: true,
    env: {
        browser: true,
        es2021: true,
        node: true
    },
    parser: 'vue-eslint-parser',
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        parser: '@typescript-eslint/parser'
    },
    plugins: ['@typescript-eslint', 'vue'],
    extends: ['plugin:vue/recommended', 'eslint:recommended'],
    rules: {}
}
