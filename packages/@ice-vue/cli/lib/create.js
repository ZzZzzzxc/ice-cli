const path = require("path");
const fs = require("fs-extra");
const inquirer = require("inquirer");
const chalk = require("chalk");
const ora = require("ora");
const { execSync } = require("child_process");

const { validateProjectName, clearConsole } = require("./util");
const { genPackageOptions, genPluginOptions } = require("./util/packageHelper");
const ProjectPackageManager = require("./ProjectPackageManager");
const writeFileTree = require("./util/writeFileTree");

const createTemplete = require("../../cli-plugin-demo");

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
  TS: {
    name: "Typescript",
    value: ["tsx", "@ice-vue/cli-plugin-typescript"],
  },
  SASS: {
    name: "Sass",
    value: ["sass", "@ice-vue/cli-plugin-sass"],
  },
  VUEX: {
    name: "Vuex",
    value: ["vuex", "@ice-vue/cli-plugin-vuex"],
  },
};

async function create(projectName) {
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

  fs.mkdirSync(targetDir); // 创建文件夹

  const { plugins } = await inquirer.prompt([
    {
      name: "plugins",
      type: "checkbox",
      message: "需要加载哪些插件",
      choices: [ACTION.DEMO, ACTION.TS, ACTION.SASS, ACTION.VUEX],
    },
  ]);

  loading.start("正在疯狂加载。。。");

  const { options: presetOptions, plugins: devDepList } = genPluginOptions(
    plugins
  );
  devDepList.push("babel-eslint");
  const depList = [];

  const packageManager = new ProjectPackageManager({ name: projectName });

  const packageOptions = await genPackageOptions(
    {
      name: projectName,
      dependencies: {},
      devDependencies: {},
    },
    devDepList,
    depList
  );

  loading.succeed("成功获取依赖版本号");

  presetOptions.config = {
    plugins: devDepList.map(item => [item, {}]),
  };

  process.chdir(targetDir);

  // 创建 package.json 文件，写入配置信息
  writeFileTree(targetDir, {
    "package.json": JSON.stringify(packageOptions, null, 2),
  });

  console.log();

  loading.succeed("🚀 初始化成功");

  packageManager.install();

  try {
    execSync("git init");
    presetOptions.git = true;
  } catch (err) {
    presetOptions.git = false;
  }

  createTemplete(presetOptions);

  loading.succeed("🎉 成功创建项目");

  console.log();
  console.log(`$ cd ${projectName}`);
  console.log("$ npm run dev");
  console.log();
}

module.exports = create;
