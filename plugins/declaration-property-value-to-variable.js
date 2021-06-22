//no-blue-color.js

const stylelint = require('stylelint');

const { report, ruleMessages, validateOptions } = stylelint.utils;
const ruleName = 'ss-style-plugin/declaration-property-value-to-variable';
const messages = ruleMessages(ruleName, {
    expected: (unfixed, fixed) => `Expected "${unfixed}" to be "${fixed}"`,
});


function insertNode({postcssRoot, keyword, file}) {
    const hasProperty = postcssRoot.nodes.find(
        ({ type, name, params }) => type === "atrule" && name === "import" && params.includes(keyword)
    );
    // 有node的时候自动加上import
    if (!hasProperty && postcssRoot.first) {
        postcssRoot.insertBefore(postcssRoot.first, file)
    }
}

module.exports = stylelint.createPlugin(ruleName, function getPlugin(primaryOption, secondaryOptionObject, context) {
    return function lint(postcssRoot, postcssResult) {
        const validOptions = validateOptions(
            postcssResult,
            ruleName,
            {
                actual: primaryOption, // 验证主选项
                possible: (option) => {
                    if (typeof option !== 'object') {
                        return false
                    }
                    const keys = Object.keys(option)
                    return keys.length && keys.every(k => {
                        return typeof option[k] === 'object'
                    });
                }, // 默认通过认证
            },
            {
                actual: secondaryOptionObject, // 验证第二选项
                possible: (option) => {
                    if (typeof option !== 'object') {
                        return false
                    }
                    return option.import;
                }, 
            }
        );

        if (!validOptions) { //If the options are invalid, don't lint
            return;
        }

        const isAutoFixing = Boolean(context.fix) && !secondaryOptionObject.disableFix;
        let insertNodeFlag = false
        const keys = Object.keys(primaryOption)

        // 不去格式化非sass的文件
        if (postcssRoot.source.lang !== 'scss') {
            return
        }


        postcssRoot.walkDecls(decl => { //Iterate CSS declarations
            const hasProps = keys.includes(decl.prop) && Object.keys(primaryOption[decl.prop]).includes(decl.value);
            if (!hasProps) {
                return; //Nothing to do with this node - continue
            }
            const targetVal = primaryOption[decl.prop][decl.value]
            if (isAutoFixing) { //We are in “fix” mode
                const newValue = decl.value.replace(decl.value, targetVal);
                insertNodeFlag = true
                //Apply the fix. It's not pretty, but that's the way to do it
                if (decl.raws.value) {
                    decl.raws.value.raw = newValue;
                } else {
                    decl.value = newValue;
                }
            } else { //We are in “report only” mode
                report({
                    ruleName,
                    result: postcssResult,
                    message: messages.expected(`${decl.prop}: ${decl.value}`, `${decl.prop}: ${targetVal}`), // Build the reported message
                    node: decl, // Specify the reported node
                    word: 'blue', // Which exact word caused the error? This positions the error properly
                });
            }
        });

        // 自动修复的时候插入css
        if (insertNodeFlag && secondaryOptionObject.import && secondaryOptionObject.import.length) {
            secondaryOptionObject.import.forEach(({keyword, file}) => insertNode({postcssRoot, keyword, file}))
        }
    };
});

module.exports.ruleName = ruleName;
module.exports.messages = messages;