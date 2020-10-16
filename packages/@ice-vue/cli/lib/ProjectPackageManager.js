const { execSync } = require("child_process");
const { hasYarn, hasCnpm, hasGit } = require("./util/env");

const SUPPORTED_PACKAGE_MANAGERS = ["yarn", "cnpm", "npm"];

const PACKAGE_MANAGER_CONFIG = {
  npm: {
    install: ["install", "--loglevel", "error"],
    remove: ["uninstall", "--loglevel", "error"],
  },
  yarn: {
    install: [],
    remove: ["remove"],
  },
};
PACKAGE_MANAGER_CONFIG.cnpm = PACKAGE_MANAGER_CONFIG.npm;

module.exports = class ProjectPackageManager {
  constructor({ name }) {
    this.name = name;
    if (hasYarn()) {
      this.bin = "yarn";
    } else if (hasCnpm()) {
      this.bin = "cnpm";
    } else {
      this.bin = "npm";
    }
  }

  runCommand(command, args = []) {
    const _commands = [
      this.bin,
      ...PACKAGE_MANAGER_CONFIG[this.bin][command],
      ...args,
    ];
    execSync(_commands.join(" "), { stdio: [0, 1, 2] });
  }

  install() {
    try {
      this.runCommand("install", ["--offline"]);
    } catch (e) {
      this.runCommand("install");
    }
  }
};
