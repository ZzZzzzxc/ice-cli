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

module.exports = {
  checkNodeVersion,
  validateProjectName,
  clearConsole,
};
