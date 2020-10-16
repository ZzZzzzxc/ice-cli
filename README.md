# 本地运行

安装根目录依赖

```
npm i 
```

安装模板依赖

```
cd .\packages\@ice-vue\cli-plugin-demo\
npm i 
```

安装 cli 依赖，并创建 ice 命令

```
cd .\packages\@ice-vue\cli\
npm i 
npm link
```

# 前言

脚手架的初始化方式主要有两种：

- 直接从远程仓库拉取对应模板，单一模板维护方便。
- 通过多个插件直接拼接成一个模板，根据用户的选择进行集成，灵活性高，如：vue-cli。

本项目选择了第二种方式，参考 vue-cli4 进行实现。

# 功能

## 代码初始化

- [ ] 插件选择
- [ ] 本地环境校验
- [ ] 获取依赖包的最新版本
- [ ] 选择包管理工具
- [ ] 交互动画

## 本地开发

## 打包

# 依赖

- babel
- chalk：控制台输出美化
- commander：命令行工具
- inquirer：交互式命令行
- ora：加载动画
- fs-extra：fs 模块增强

# package.json 字段

- bin：用于指定各个内部命令对应的可执行文件的位置。

# npm-cli 命令

npm link 
