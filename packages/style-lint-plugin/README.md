# stylelint-config-ss

自动转变css属性值的插件,限制字体和line-height对应


## Installation

1. If you haven't, install [stylelint]:

```
npm install stylelint --save-dev
```

2.  Install `stylelint-config-ss`:

```
npm install stylelint-config-ss --save-dev
```

## Usage

Add `stylelint-config-ss` to your stylelint config `extends` , then add rules you need to the rules list. All rules from stylelint-config-ss need to be namespaced with `ss-style-plugin`.

```json
{
  "extends": [
    "stylelint-config-ss"
  ],
  "rules": {
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
                "severity": "warning" // 报错方式只是警告不是错误
            }
        ],
    "ss-style-plugin/declaration-property-value-to-variable": [
      {
        "/color/": {
          "/#bbb/i": "$abc"
        },
        "/border/": {
          "/#ccc/i": "$b"
        }
      },
      {
        "severity": "warning", 
        "import": [
          {
            "keyword": [
              "colors.scss",
              "variable/_colors"
            ],
            "file": "@import 'variable/_colors.scss';"
          }
        ]
      }
    ]
  }
}
```

## Rules

* `ss-style-plugin/declaration-property-value-to-variable`: 自动转变css属性值的插件，支持自动修复
* `ss-style-plugin/font-with-line-height`: 限制字体和line-height要对应，不支持自动修复


## Autofixing

`ss-style-plugin/declaration-property-value-to-variable` supports autofixing with `stylelint --fix`. [postcss-sorting] is used internally for order autofixing.



Autofixing is enabled by default if it's enabled in stylelint's configuration file. It can be disabled on a per rule basis using the secondary option `disableFix: true`. Here's an example:

```json
	"rules": {
         
        "ss-style-plugin/declaration-property-value-to-variable": [
            {
                "/color/": {
                "/#bbb/i": "$abc"
                },
                "/border/": {
                "/#ccc/i": "$b"
                }
            },
            {
                "severity": "warning", 
                "disableFix": true,
                "import": [
                {
                    "keyword": [
                    "colors.scss",
                    "variable/_colors"
                    ],
                    "file": "@import 'variable/_colors.scss';"
                }
                ]
            }
            ]
	}
```




## Thanks
- [stylelint](https://stylelint.io/)
