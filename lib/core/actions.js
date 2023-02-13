const { promisify } = require("util");
const { vueRepo } = require("../config/repo-config");
const { commandSpawn } = require("../utils/terminal");
const path = require("path");

const { compile, writeToFile, createDirSync } = require("../utils/utils");

const download = promisify(require("download-git-repo"));
const createProjectAction = async (project) => {
  await download(vueRepo, project, { clone: true });
  console.log("下载完成");
  const command = process.platform === "win32" ? "npm.cmd" : "npm";
  await commandSpawn(command, ["install"], { cwd: `./${project}` });
  console.log("依赖下载完成");
  commandSpawn(command, ["run", "serve"], { cwd: `./${project}` });
  console.log("运行成功");
};

// 添加组件的action
const addComponentAction = async (name, dest) => {
  // 1.编译ejs模板 result
  const result = await compile("vue-component.ejs", {
    name,
    lowerName: name.toLowerCase(),
  });

  // 2.写入文件的操作
  const targetPath = path.resolve(dest, `${name}.vue`);
  if (createDirSync(dest)) {
    try {
      await writeToFile(targetPath, result);
      console.log(targetPath, "文件创建成功");
    } catch (error) {
      console.log("文件已存在");
    }
  }
};

// 添加组件的action
const addRouterAction = async (name, dest) => {
  // 1.编译ejs模板 result
  const result = await compile("vue-router.ejs", {
    name,
    lowerName: name.toLowerCase(),
  });

  // 2.写入文件的操作
  const targetPath = path.resolve(dest, `${name}.js`);
  console.log("targetPath", targetPath);
  if (createDirSync(dest)) {
    try {
      await writeToFile(targetPath, result);
      console.log(targetPath, "文件创建成功");
    } catch (error) {
      console.log("文件已存在");
    }
  }
};
// 添加组件的action
const addRCAction = async (name, dest) => {
  const routerDest = dest.replace("src/view", "src/router");
  const importPath = dest.replace("src", "@");
  console.log(dest, routerDest, importPath);
  // 1.编译ejs模板 result
  const routerResult = await compile("vue-router.ejs", {
    name,
    lowerName: name.toLowerCase(),
    dest: importPath,
  });
  const cpnResult = await compile("vue-component.ejs", {
    name,
    lowerName: name.toLowerCase(),
  });

  // 2.写入文件的操作

  const routerTargetPath = path.resolve(routerDest, `${name}.js`);
  const cpnTargetPath = path.resolve(dest, `${name}.vue`);

  if (createDirSync(routerDest)) {
    try {
      await writeToFile(routerTargetPath, routerResult);
      console.log(routerTargetPath, "文件创建成功");
    } catch (error) {
      console.log(routerTargetPath, "文件已存在");
    }
  }
  if (createDirSync(dest)) {
    try {
      await writeToFile(cpnTargetPath, cpnResult);
      console.log(cpnTargetPath, "文件创建成功");
    } catch (error) {
      console.log(cpnTargetPath, "文件已存在");
    }
  }
};

module.exports = {
  createProjectAction,
  addComponentAction,
  addRouterAction,
  addRCAction,
};
