const program = require("commander");
const { createProjectAction, addComponentAction, addRouterAction, addRCAction } = require("./actions");
const createCommands = () => {
  program.command("create <project> [others...]").description("创建新项目").action(createProjectAction);

  program
    .command("addcpn <name>")
    .option("-d --dest <dest>")
    .description("添加vue3组件, 例如: xiaocai addcpn HelloWorld [-d src/components]")
    .action((name, option) => {
      addComponentAction(name, option.dest || "src/components");
    });
  program
    .command("addRouter <name>")
    .option("-d --dest <dest>")
    .description("添加异步路由, 例如: xiaocai addRouter HelloWorld [-d src/router/main]")
    .action((name, option) => {
      addRouterAction(name, option.dest || "src/router/main");
    });
  program
    .command("addRC <name>")
    .option("-d --dest <dest>")
    .description("添加异步路由和对应组件, 例如: xiaocai addRC HelloWorld [-d src/view/main]")
    .action((name, option) => {
      addRCAction(name, option.dest || `src/views/main`);
    });
};
module.exports = {
  createCommands,
};
