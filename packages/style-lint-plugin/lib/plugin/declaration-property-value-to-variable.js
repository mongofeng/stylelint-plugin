

const stylelint = require('stylelint');

const { report, ruleMessages, validateOptions } = stylelint.utils;
const matchesStringOrRegExp = require('../utils/matchesStringOrRegExp')
const string2RegExp = require('../utils/string2RegExp')
const ruleName = 'ss-style-plugin/declaration-property-value-to-variable';
const messages = ruleMessages(ruleName, {
    expected: (unfixed, fixed) => `Expected "${unfixed}" to be "${fixed}"`,
});


function insertNode({ postcssRoot, keyword, file }) {
    const hasProperty = postcssRoot.nodes.find(
        ({ type, name, params }) => type === "atrule" && name === "import" && keyword.some(k => params.includes(k))
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
                    const primaryOptionKeys = Object.keys(option)
                    return primaryOptionKeys.length && primaryOptionKeys.every(k => {
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

        if (!validOptions) { //如果选项无效，不是校验
            return;
        }
        // --fix选项
        const isAutoFixing = Boolean(context.fix) && !secondaryOptionObject.disableFix;
        let insertNodeFlag = false
        const keys = Object.keys(primaryOption)

        // 不去格式化非sass的文件
        if (postcssRoot.source.lang !== 'scss') {
            return
        }


        postcssRoot.walkDecls(decl => {

            const prop = decl.prop;
			const value = decl.value;

            // 判断是否包含
            const hasProps = matchesStringOrRegExp(prop, keys)
            if (!hasProps) {
                return
            }
            const { pattern } = hasProps

            const hasValue = matchesStringOrRegExp(value, Object.keys(primaryOption[pattern]) )

            if (!hasValue) {
                return
            }

            const targetVal = primaryOption[pattern][hasValue.pattern]
            const newValue = value.replace(string2RegExp(hasValue.pattern), targetVal);
            if (isAutoFixing) { // 修复模式下
                insertNodeFlag = true
                if (decl.raws.value) {
                    decl.raws.value.raw = newValue;
                } else {
                    decl.value = newValue;
                }
            } else { // 不修复去报告
                report({
                    ruleName,
                    result: postcssResult,
                    message: messages.expected(`${prop}: ${value}`, `${prop}: ${newValue}`), // 生成报告的消息
                    node: decl, // 指定报告的节点
                    word: decl.value, // 哪个词导致了错误？这将正确定位错误
                });
            }
        });

        // 自动修复的时候插入css
        if (insertNodeFlag && secondaryOptionObject.import && secondaryOptionObject.import.length) {
            secondaryOptionObject.import.forEach(({ keyword, file }) => insertNode({ postcssRoot, keyword, file }))
        }
    };
});

module.exports.ruleName = ruleName;
module.exports.messages = messages;