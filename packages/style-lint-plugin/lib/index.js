const path = require('path');

const ssRule = {
    'named-grid-areas-no-invalid': null, // 修复stylelint莫名的问题https://github.com/stylelint/stylelint-config-standard/issues/174
    'declaration-block-no-duplicate-custom-properties': null,

    // 下面是定制化配置的
    'at-rule-no-unknown': null,  // 禁止使用未知规则@。（待讨论less)
    'selector-type-no-unknown': null, // 禁止未知类型选择器 ::ng-deep的问题
    'selector-pseudo-element-no-unknown': [true, {
        ignorePseudoElements: 'ng-deep'
    }],
    'font-family-no-missing-generic-family-keyword': null, // family
    'selector-no-qualifying-type': null, // 不允许按类型限定选择器, 例如a.foo 。（不使用


    // 开启的
    // 'value-no-vendor-prefix': true, // ：禁止使用值的供应商前缀（可自动修复）。
    'shorthand-property-no-redundant-values': true, //禁止在速记属性中使用冗余值（可自动修复）


    // 开启的
    'alpha-value-notation': "number", // 为Alpha值指定百分数或数字（可自动修复）
    'color-named': "never", // 要求（在可能的情况下）或禁止命名的颜色。
    'length-zero-no-unit': true, // 不允许长度为零的单位，0情况下是否去掉单位（可自动修复）。
    'selector-pseudo-element-colon-notation': 'double', // ：为适用的伪元素指定单冒号或双冒号表示法（可自动修复， 使用双引号
    // 禁止掉的
    'declaration-block-single-line-max-declarations': null, //限制单行声明块中的声明数量（不能自动修复
    'custom-property-pattern': null, // 指定自定义属性变量，正则字符串。
    'keyframe-declaration-no-important': null, // ：不允许!important在关键帧声明中使用**。
    'color-no-hex': null, //：禁止使用十六进制颜色。
    'font-weight-notation': null, // font-weight值关键字还是数字
    'number-max-precision': null, // 限制数字中允许的小数位数
    'time-min-milliseconds': null, //指定时间值的最小毫秒数。
    'declaration-block-no-redundant-longhand-properties': null,  //：禁止将可合并为一个速记属性的速记属性。（需要手动修复）
    'declaration-no-important': null, //：禁止!important在声明中使用。
    // 自定义规则
    'selector-class-pattern': '^[^A-Z]+', // 类选择器模式禁止驼峰，小写横杠
}

module.exports = {
    plugins: [
        path.join(__dirname, './plugin/font-with-line-height.js'),
        path.join(__dirname, './plugin/declaration-property-value-to-variable.js')
    ],
    rules: {
        ...ssRule,
        "at-rule-semicolon-newline-after": null,  // 自动import问题在这里会产生undefined
        "ss-style-plugin/font-with-line-height": [
            {
                "font-size": {
                    "withProperties": "line-height",
                    "value": {
                        "18px": "28px",
                        "16px": "24px",
                        "14px": "22px",
                        "12px": "18px"
                    }
                }
            },
            {
                "severity": "warning"
            }
        ],
    },
};
