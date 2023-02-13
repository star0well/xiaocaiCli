const program = require("commander");

const heloOptions = () => {
  program.option("-c ,--cai", "xiaocai cli");

  program.option("a destination folder, 例如: -d /src/components");
};
module.exports = {
  heloOptions,
};
