首先这是一个玩具。

# 本地运行

安装根目录依赖

```
npm i 
```

安装 cli 依赖，并创建 ice 命令

```
cd .\packages\@ice\cli\
npm i 
npm link
```

# 项目结构

```js
└─packages
    ├─@ice // ice 脚手架
    │  ├─cli // core
    │  │  │
    │  │  ├─bin // 命令集
    │  │  │      ice.js // ice 命令
    │  │  │
    │  │  ├─generator // 生成器
    │  │  │  │  index.js // 入口，进行模板加载
    │  │  │  │
    │  │  │  └─template // 模板
    │  │  │
    │  │  └─lib
    │  │      │  create.js // 初始化项目功能入口
    │  │      │  ProjectPackageManager.js // 包管理类
    │  │      │  update.js // cli升级，还没做
    │  │      │
    │  │      └─util 工具方法集
    │  │
    │  └─cli-plugin //（还未做）对应的插件模板，可单独发布至npm
    └─test // 又不是不能用

```


# 核心依赖

- chalk：控制台输出美化
- commander：命令行工具
- inquirer：交互式命令行
- ora：加载动画
- fs-extra：fs 模块增强

# package.json 字段

- bin：用于指定各个内部命令对应的可执行文件的位置。

# npm-cli 命令

npm link 


# cli

脚手架的初始化方式主要有两种：

- 从远程仓库直接拉取对应模板，优点是单一模板维护方便。
- 通过多个插件直接拼接成一个模板，根据用户的选择进行插件的集成，灵活性高,如：vue-cli。

本项目选择了第二种方式，参考 vue-cli4 进行实现。

# TODO

## 代码初始化

- [x] 插件选择
- [x] 本地环境校验
- [x] 获取依赖包的最新版本
- [ ] 选择包管理工具
- [ ] 友好的交互

## 本地开发

## 打包