const matchesStringOrRegExp = require("../utils/matchesStringOrRegExp");
const postcss = require("postcss");
const stylelint = require("stylelint");
const report = stylelint.utils.report;
const ruleMessages = stylelint.utils.ruleMessages;
const validateOptions = stylelint.utils.validateOptions;

const ruleName = 'ss-style-plugin/font-with-line-height';
const messages = ruleMessages(ruleName, {
  rejected: (ignore, cause) => `Expected "${ignore}" to "${cause}"`
});

const ignored = [
];

const rule = (primaryOption) => {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, { actual: primaryOption, possible: (opt) => {
      return typeof opt === 'object' && Object.keys(opt).length 
    } });

    if (!validOptions) {
      return;
    }
    
    if (!ignored.length) {
      Object.keys(primaryOption).forEach(property => {
        Object.keys(primaryOption[property].value).forEach(value => {
          ignored.push({
            property,
            value,
            withProperties: primaryOption[property].withProperties,
            withPropertiesValues: primaryOption[property].value[value]
          })
        })
      })
    }
    
    root.walkRules(rule => {
      const uniqueDecls = {};
      rule.walkDecls(decl => {
        uniqueDecls[decl.prop] = decl;
      });


      function check(prop, index) {
        const decl = uniqueDecls[prop];
        const value = decl.value;
        const unprefixedProp = postcss.vendor.unprefixed(prop);
        const unprefixedValue = postcss.vendor.unprefixed(value);

        ignored.forEach(ignore => {
          // 筛选出符合的属性和值
          const matchProperty = matchesStringOrRegExp(
            unprefixedProp.toLowerCase(),
            ignore.property
          );
          const matchValue = matchesStringOrRegExp(
            unprefixedValue.toLowerCase(),
            ignore.value
          );

          if (!matchProperty || !matchValue) {
            return;
          }

          const withPropertiesValues = ignore.withPropertiesValues;

          const properties = ignore.withProperties

          decl.parent.nodes.forEach((node, nodeIndex) => {
            if (
              !node.prop ||
              index === nodeIndex ||
              !matchesStringOrRegExp( 
                node.prop.toLowerCase(),
                properties
              ) ||
              matchesStringOrRegExp(  // 包含的时候跳过
                node.value.toLowerCase(),
                withPropertiesValues
              )
            ) {
              return;
            }
            const expect = decl.toString() + ' ;' + node.toString()
            const to = decl.toString() + ' ;' + node.prop + ':' + withPropertiesValues.toString()
            report({
              message: messages.rejected(expect, to),
              node,
              result,
              ruleName
            });
          });
        });
      }

      Object.keys(uniqueDecls).forEach(check);
    });
  };
};

module.exports = stylelint.createPlugin(ruleName, rule);
module.exports.ruleName = ruleName;
module.exports.messages = messages;
