const { lint } = require("stylelint");
const path = require('path')
async function main () {
  const res = await lint({
    fix: true,
    files: 'src/asset/radio.scss', // 相对 glob 将被认为是 globbyOptions.cwd 的相对路径。
    configBasedir: path.resolve(__dirname, './')
  });

  const {
    results: [{ warnings, parseErrors }]
  } = res

  console.log(res)
}


main()