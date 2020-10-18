/**
 * @jye/template
 */
const fs = require("fs-extra");
const path = require("path");
const { writeFileTree } = require("../lib/util");

const TEMPLATE_PATH = path.join(__dirname, "./template");

const generator = {
  public: genPublic,
  src: genSrc,
  ".gitignore": genGitignore,
  "ice.config.json": genConfigFile,
  "README.md": genReadme,
};

function genPublic(config, filename) {
  copyFile(filename);
}

function genSrc(config, filename) {
  copyFile(filename);
}

function genConfigFile({ iceConfig }) {
  writeFileTree(process.cwd(), {
    "ice.config.json": `${JSON.stringify(iceConfig, null, 2)}`,
  });
}

function genGitignore({ git }, filename) {
  if (git) {
    copyFile(filename);
  }
}

function genReadme(config, filename) {
  copyFile(filename);
}

function copyFile(filename) {
  const sourcePath = path.join(TEMPLATE_PATH, filename);
  const newPath = path.join(process.cwd(), filename);
  fs.copySync(sourcePath, newPath);
}

module.exports = options => {
  const files = fs.readdirSync(TEMPLATE_PATH);
  files.forEach(filename => {
    if (typeof generator[filename] === "function") {
      generator[filename](options, filename);
    } else {
      copyFile(filename);
    }
  });
};
