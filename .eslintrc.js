module.exports = {
    root: true,
    env: {
        node: true,
    },
    extends: ['plugin:vue/vue3-essential', '@vue/airbnb', '@vue/prettier'],
    parserOptions: {
        parser: 'babel-eslint',
    },
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'comma-dangle': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        indent: ['error', 4, { SwitchCase: 1 }],
        'arrow-parens': [2, 'always'],
    },
    overrides: [
        {
            files: ['**/__tests__/*.{j,t}s?(x)', '**/tests/unit/**/*.spec.{j,t}s?(x)'],
            env: {
                jest: true,
            },
        },
    ],
};
// Switch case statement
// https://stackoverflow.com/questions/53055300/cannot-fix-eslint-rule-on-indenting-case-statements-in-switch-statement
