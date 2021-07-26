module.exports = {
    root: true,
    extends: '@react-native-community',
    globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
    },
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 2018,
        sourceType: 'module',
    },
    plugins: ['react', 'react-native'],
    rules: {
        'react/jsx-filename-extension': [1, {extensions: ['.js', '.jsx']}], // 在JS文件中允许存在JSX语法
        'indent':['error', 4], // 缩进规则为4个空格
        'react/jsx-indent':['error', 4], // 缩进规则为4个空格
        'react/jsx-indent-props':['error', 4], // 缩进规则为4个空格
        'no-inline-comments': 0, // 禁止行内备注
        'no-lone-blocks': 2, // 禁用不必要的嵌套块
        'no-empty': 2, // 禁止空块语句
        'react-native/no-inline-styles': 0, // 允许行内样式
        'max-len' : ['error', {code : 200}],
        'eqeqeq': 0, // == ===
        'react/no-string-refs':0,
        'array-bracket-newline': [2, 'consistent'], // 在数组开括号后和闭括号前强制换行
        'array-bracket-spacing': 2, // 强制在括号内前后使用空格
        'block-spacing': 2, // 强制在代码块中开括号前和闭括号后有空格
        'brace-style': 2, // 大括号风格要求
        'semi-spacing': 2, // 强制分号前后有空格
        'semi-style': 2, // 分号风格
        'camelcase': 2, // 要求使用骆驼拼写法
        'comma-spacing': 2, // 强制在逗号周围使用空格
        'spaced-comment': 2, // 要求在注释前有空白
        'ignoreComments': 0,
        'prettier/prettier': [
            // eslint校验不成功后，error或2则报错，warn或1则警告，off或0则无提示
            'off',
            {
                // 不要分号
                semi: false,
                // 设置单引号
                singleQuote: true,
                // 设置换行长度
                printWidth: 160,
            },
        ],
    },
};
