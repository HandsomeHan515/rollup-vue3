module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        sourceType: 'module'
    },
    rules: {
        'space-before-function-paren': ['error', 'always'], // 括号之前有空格
        'quote-props': 'off', // object的key使用引号
        'quotes': ['error', 'single'], // 使用单引号
        'indent': ['error', 4], // js tab size (包含 .vue 的 script)
    }
}
