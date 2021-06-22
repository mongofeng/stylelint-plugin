1. husky-init 是一个一次性命令，用于使用 husky 快速初始化项目。

```shell
npx husky-init && npm install       # npm
npx husky-init && yarn              # Yarn 1
yarn dlx husky-init --yarn2 && yarn # Yarn 2
```
它将设置 husky，修改package.json并创建一个pre-commit您可以编辑的示例挂钩。默认情况下，它会npm test在您提交时运行。
生成husky文件下pre-commit

2. (可选)要添加另一个钩子commitlint信息，请使用husky add.

例如：

```shell
npx husky add .husky/commit-msg 'npx --no-install commitlint --edit "$1"'
```

3. 配合lint-staged，可以只检查 staged 文件，提高效率
```shell
npx mrm@2 lint-staged
```