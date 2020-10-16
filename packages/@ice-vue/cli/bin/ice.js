#!/usr/bin/env node

// entry
const program = require("commander");
const version = require("../package.json").version;
const chalk = require("chalk");

const suggestCommands = require("../lib/util/suggestCommands");
const { checkNodeVersion } = require("../lib/util");
const create = require("../lib/create");

const availableCommands = program.commands.map(cmd => cmd._name);

// checkNodeVersion();

program.version(version, "-v, -V, --version").usage("<command> [options]");

program
  .command("create <app-name>")
  .description("使用 ice-cli 创建一个新的项目")
  .option("-d --dir <dir>", "创建目录")
  .action(name => {
    create(name);
  });

program.arguments("<command>").action(cmd => {
  program.outputHelp();
  console.log(`  ` + chalk.red(`Unknown command ${chalk.yellow(cmd)}.`));
  console.log();
  suggestCommands(availableCommands, cmd);
});

program.parse(process.argv);
