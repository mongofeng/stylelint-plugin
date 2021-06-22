// index.test.js
const { lint } = require("stylelint");
const path = require('path')
const {ruleName} = require('./declaration-property-value-to-variable.js')

const config = {
  plugins: ["./plugins/declaration-property-value-to-variable.js"],
  rules: {
    [ruleName]: [{ 
      "color": {
        "green": "$abc",
        "#fff": "$white"
      }
    }, {
      "import": [
        {
          "keyword": "colors.scss",
          "file": "@import 'variable/_colors.scss';"
        }
      ],
      "disableFix": true
    }]
  }
};

it("检查scss文件是否有错误", async () => {
  const {
    results: [{ warnings, parseErrors }]
  } = await lint({
    files: 'src/b.scss', 
    configBasedir: path.resolve(__dirname, '../'),
    config
  });
  console.log(parseErrors)
  console.log(warnings)

  // [
  //   {
  //     line: 3,
  //     column: 3,
  //     rule: 'ss-style-plugin/declaration-property-value-to-variable',
  //     severity: 'error',
  //     text: 'Expected "color: green" to be "color: $abc" (ss-style-plugin/declaration-property-value-to-variable)'
  //   },
  //   {
  //     line: 8,
  //     column: 3,
  //     rule: 'ss-style-plugin/declaration-property-value-to-variable',
  //     severity: 'error',
  //     text: 'Expected "color: #fff" to be "color: $white" (ss-style-plugin/declaration-property-value-to-variable)'
  //   }
  // ]
  expect(parseErrors).toHaveLength(0);
  expect(warnings).toHaveLength(2);

  const [{ line, column, text }] = warnings;

  expect(text).toBe(
    `Expected "color: green" to be "color: $abc" (ss-style-plugin/declaration-property-value-to-variable)`
  );
  expect(line).toBe(3);
  expect(column).toBe(3);
});



it("检查css文件是否通过测试", async () => {
  const {
    results: [{ warnings, parseErrors }]
  } = await lint({
    // code: "@import url(unknown.css)",
    files: 'src/a.css', // 相对 glob 将被认为是 globbyOptions.cwd 的相对路径。
    configBasedir: path.resolve(__dirname, '../')
  });
  expect(parseErrors).toHaveLength(0);
  expect(warnings).toHaveLength(0);
});