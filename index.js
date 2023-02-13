#!/usr/bin/env node
const program = require("commander");
const { createCommands } = require("./lib/core/create");
const { heloOptions } = require("./lib/core/help");
program.version(require("./package.json").version);
//帮助可选信息
heloOptions();
createCommands();
program.parse(process.argv);
