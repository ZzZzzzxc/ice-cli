const path = require("path");
const fs = require("fs-extra");
const inquirer = require("inquirer");
const chalk = require("chalk");
const ora = require("ora");
const { execSync } = require("child_process");
const {
  hasGit,
  errorCaptured,
  writeFileTree,
  validateProjectName,
  clearConsole,
  genPackageOptions,
  genPluginOptions,
} = require("./util");
const ProjectPackageManager = require("./ProjectPackageManager");
const createTemplete = require("../generator");

const loading = ora({
  prefixText: "[ICE]",
  color: "cyan",
  spinner: "weather",
});

const ACTION = {
  OVERWRITE: {
    name: "重写",
    value: "overwrite",
  },
  CANCEL: {
    name: "取消",
    value: "cancel",
  },
  DEMO: {
    name: "demo",
    value: ["demo", "vue"],
  },
};

const DEV_DEP_DEFAULT = ["babel-eslint"];
const DEP_DEFAULT = [];

async function create(projectName) {
  // 校验项目名称
  validateProjectName(projectName);

  const cwd = process.cwd();
  const targetDir = path.resolve(cwd, projectName || ".");

  // 文件夹已经存在
  if (fs.existsSync(targetDir)) {
    clearConsole();
    const { action } = await inquirer.prompt([
      {
        name: "action",
        type: "list",
        message: `目录 ${chalk.cyan(targetDir)} 已经存在，请选择下一步：`,
        choices: [ACTION.OVERWRITE, ACTION.CANCEL],
      },
    ]);

    if (action === ACTION.CANCEL.value) {
      process.exit(1); // 返回上一步
    }

    if (action === ACTION.OVERWRITE.value) {
      console.log(`\n正在移除 ${chalk.cyan(targetDir)}。。。`);
      await fs.remove(targetDir); // 移除文件夹
      console.log(` ${chalk.cyan(targetDir)}被成功移除`);
    }
  }

  // 创建文件夹
  fs.mkdirSync(targetDir);

  // 插件选择
  const { plugins } = await inquirer.prompt([
    {
      name: "plugins",
      type: "checkbox",
      message: "需要加载哪些插件",
      choices: [ACTION.DEMO],
    },
  ]);

  loading.start("正在疯狂加载。。。");

  // 生成被选中插件的配置信息
  const { options: presetOptions, plugins: devDepList } = genPluginOptions(
    plugins
  );
  // 添加默认本地依赖
  devDepList.push(...DEV_DEP_DEFAULT);
  // 添加生成环境依赖
  const depList = [...DEP_DEFAULT];
  // 初始化包管理器
  const packageManager = new ProjectPackageManager({ name: projectName });
  // 生成 package.json 配置信息
  const [err, packageOptions] = await errorCaptured(
    genPackageOptions,
    {
      name: projectName,
      dependencies: {},
      devDependencies: {},
    },
    devDepList,
    depList
  );

  if (!err) {
    // 添加脚手架配置文件
    presetOptions.iceConfig = {
      plugins: devDepList.map(item => [item, {}]),
    };

    // 进入目标路径
    process.chdir(targetDir);

    // 创建 package.json 文件，写入配置信息
    writeFileTree(targetDir, {
      "package.json": JSON.stringify(packageOptions, null, 2),
    });

    console.log();

    loading.succeed("🚀 成功生成 package.json 文件");

    packageManager.install();

    // git 初始化
    if (hasGit()) {
      try {
        execSync("git init");
        presetOptions.git = true;
      } catch (err) {
        presetOptions.git = false;
      }
    }

    createTemplete(presetOptions);

    loading.succeed("🎉 成功创建项目");

    console.log();
    console.log(`$ cd ${projectName}`);
    console.log("$ npm run dev");
    console.log();
  } else {
    loading.stop();
    throw err;
  }
}

module.exports = create;
