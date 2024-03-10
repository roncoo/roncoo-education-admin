module.exports = {
    root: true,
    env: {
        browser: true,
        es2021: true,
        node: true
    },
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    extends: ['plugin:vue/vue3-essential', 'eslint:recommended'],
    rules: {
        "space-before-function-paren": 0,
        "vue/no-multiple-template-root":'off',
        'vue/multi-word-component-names':'off'
    }
}
