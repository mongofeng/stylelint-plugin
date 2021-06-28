const { lint } = require("stylelint");
const path = require('path')
const {ruleName} = require('./lib/index.js')
const config = {
  extends: ["./lib/index.js"],
  rules: {
    [ruleName]:  [{ 
      "/color/": {
        "/#bbb/i": "$abc",
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


async function main () {
  const res = await lint({
    config,
    // fix: true,
    files: 'src/b.scss', // 相对 glob 将被认为是 globbyOptions.cwd 的相对路径。
    configBasedir: path.resolve(__dirname, './')
  });

  const {
    results: [{ warnings, parseErrors }]
  } = res

  console.log(res)
}


main()