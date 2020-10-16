const { exec } = require("child_process");
const { hasCnpm } = require("./env");

const DEFAULT_PACKAGE_OPTIONS = {
  version: "1.0.0",
  private: true,
  description: "",
  main: "index.js",
  scripts: {},
  keywords: [],
  author: "",
  license: "ISC",
};

function getDepVersion(depName) {
  const manager = hasCnpm() ? "cnpm" : "npm";
  return new Promise((resolve, reject) => {
    exec(`${manager} view ${depName} version`, (err, stdout, stderr) => {
      if (err) {
        reject(err);
      } else {
        resolve({ [depName]: stdout.slice(0, stdout.length - 1) });
      }
    });
  });
}

function genGetDepVersionPromise(depList) {
  const promises = [];
  depList.forEach(depName => {
    promises.push(getDepVersion(depName));
  });
  return promises;
}

async function genPackageOptions(options, devDepList, depList) {
  const { name, ...rest } = options;
  const result = {
    name,
    ...DEFAULT_PACKAGE_OPTIONS,
    ...rest,
  };

  await Promise.all([
    ...genGetDepVersionPromise(devDepList),
    ...genGetDepVersionPromise(depList),
  ]).then(res => {
    const devDep = res.splice(0, devDepList.length);
    const dep = res;
    // 合并
    devDep.map(item => {
      result.devDependencies = { ...result.devDependencies, ...item };
    });
    dep.map(item => {
      result.dependencies = { ...result.dependencies, ...item };
    });
  });

  return result;
}

function genPluginOptions(_plugin) {
  const options = {};
  const plugins = [];

  _plugin.forEach(item => {
    const [opt, ...rest] = item;
    options[opt] = true;
    plugins.push(...rest);
  });

  return { options, plugins };
}

module.exports = { genPackageOptions, genPluginOptions };
