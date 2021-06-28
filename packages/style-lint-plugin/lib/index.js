const path = require('path');

module.exports = {
    plugins: [
        path.join(__dirname, './plugin/font-width-line-height.js'),
        path.join(__dirname, './plugin/declaration-property-value-to-variable.js')
    ],
    rules: {
        "at-rule-semicolon-newline-after": null,  // 自动import问题在这里会产生undefined
        "ss-style-plugin/font-width-line-height": [
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
