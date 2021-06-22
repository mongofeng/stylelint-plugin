// index.test.js
const { lint } = require("stylelint");
const path = require('path')
const {ruleName} = require('./declaration-property-value-to-variable.js')




it("检查自动修复的问题", async () => {
  const config = {
    plugins: ["./plugins/declaration-property-value-to-variable.js"],
    rules: {
      [ruleName]:  [{ 
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
        "disableFix": false
      }]
    }
  };

  const res = await lint({
    files: 'src/autofix.scss', 
    config,
    fix: true,
    configBasedir: path.resolve(__dirname, '../'),
  });
  const {
    errored,
    results: [{ warnings, parseErrors }],
  } = res
  expect(parseErrors).toHaveLength(0);
  expect(warnings).toHaveLength(0);
  expect(errored).toBeFalsy()


  const {
    errored: importError,
  } = await lint({
    files: 'src/autofix-with-import.scss', 
    config,
    fix: true,
    configBasedir: path.resolve(__dirname, '../'),
  });

  expect(importError).toBeFalsy()
});


test('检查插件的选项', async () => {
  const config = {
    plugins: ["./plugins/declaration-property-value-to-variable.js"],
    rules: {
      [ruleName]: [true, false]
    }
  };
  const res =  await lint({
    files: 'src/b.scss', 
    configBasedir: path.resolve(__dirname, '../'),
    config
  });
  const {
    errored,
    results: [{ invalidOptionWarnings }],
  } = res
  const [{ text }, {text: secondOptionText}] = invalidOptionWarnings;

  expect(errored).toBeTruthy()
  expect(text).toMatch('Invalid option')
  expect(secondOptionText).toMatch('Invalid option')
});


it("检查scss文件是否有错误", async () => {
  const {
    results: [{ warnings, parseErrors }],
  } = await lint({
    files: 'src/b.scss', 
    configBasedir: path.resolve(__dirname, '../'),
  });
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