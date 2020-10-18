const packageHelper = require("./packageHelper");
const env = require("./env");
const suggestCommands = require("./suggestCommands");
const writeFileTree = require("./writeFileTree");

const validateNpmPackageName = require("validate-npm-package-name");

function checkNodeVersion() {}

function validateProjectName(name) {
  const result = validateNpmPackageName(name);
  if (!result.validForNewPackages) {
    console.error(chalk.red(`Invalid project name: "${name}"`));
    result.errors &&
      result.errors.forEach(err => {
        console.error(chalk.red.dim("Error: " + err));
      });
    result.warnings &&
      result.warnings.forEach(warn => {
        console.error(chalk.red.dim("Warning: " + warn));
      });
    exit(1);
  }
}

function clearConsole() {
  process.stdout.write(
    process.platform === "win32" ? "\x1Bc" : "\x1B[2J\x1B[3J\x1B[H"
  );
}

async function errorCaptured(asyncFunc, ...args) {
  try {
    const res = await asyncFunc(...args);
    return [null, res];
  } catch (err) {
    return [err, null];
  }
}

module.exports = {
  checkNodeVersion,
  validateProjectName,
  clearConsole,
  errorCaptured,
  ...packageHelper,
  ...env,
  suggestCommands,
  writeFileTree,
};
