const { promisify } = require("util");
const { vueRepo } = require("../config/repo-config");
const { commandSpawn } = require("../utils/terminal");
const fs = require("fs");
const { compile, writeToFile, createDirSync } = require("../utils/utils");
const path = require("path");
const inquirer = require("inquirer");

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
  const routerDest = dest.replace("src/views", "src/router");
  const importPath = dest.replace("src", "@");
  const tempArry = dest.split("/");
  const routerPath = tempArry.slice(tempArry.length - 2).join("/");
  // 1.编译ejs模板 result
  const routerResult = await compile("vue-router.ejs", {
    name,
    lowerName: name.toLowerCase(),
    dest: importPath,
    path: routerPath,
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
  testAction(name, routerPath);
};

const addCRUD = async (name, dest) => {
  const routerDest = dest.replace("src/views", "src/router");
  const importPath = dest.replace("src", "@");

  const tempArry = dest.split("/");
  const routerPath = tempArry.slice(tempArry.length - 2).join("/");
  // 1.编译ejs模板 result
  const routerResult = await compile("vue-router.ejs", {
    name,
    lowerName: name.toLowerCase(),
    dest: importPath,
    path: routerPath,
  });

  const cpnResult = await compile("vue-crud.ejs", {
    name,
    lowerName: name.toLowerCase(),
  });
  const configResult = await compile("config.ejs", {
    lowerName: name.toLowerCase(),
  });
  const serverResult = await compile("server.ejs", {
    lowerName: name.toLowerCase(),
  });

  // 2.写入文件的操作

  const routerTargetPath = path.resolve(routerDest, `${name}.js`);
  const cpnTargetPath = path.resolve(dest, `${name}.vue`);
  const configPath = path.resolve(dest, `${name}Config.js`);
  const serverPath = path.resolve(`src/service/${name.toLowerCase()}`, `${name.toLowerCase()}.js`);  
  if (createDirSync(routerDest)) {
    try {
      await writeToFile(routerTargetPath, routerResult);
      console.log(routerTargetPath, "文件创建成功");
    } catch (error) {
      console.log(routerTargetPath, "文件已存在");
    }
  }
  if (createDirSync(`src/service/${name.toLowerCase()}`)) {
    try {
      await writeToFile(serverPath, serverResult);
      console.log(serverPath, "文件创建成功");
    } catch (error) {
      console.log(serverPath, "文件已存在");
    }
  }
  if (createDirSync(dest)) {
    try {
      await writeToFile(cpnTargetPath, cpnResult);
      console.log(cpnTargetPath, "文件创建成功");
    } catch (error) {
      console.log(cpnTargetPath, "文件已存在");
    }
    try {
      await writeToFile(configPath, configResult);
      console.log(configPath, "文件创建成功");
    } catch (error) {
      console.log(configPath, "文件已存在");
    }
  }
  testAction(name, routerPath);
};
const testAction = async (name, routerPath) => {
  const res = await inquirer.prompt([
    {
      name: "name",
      type: "input",
      message: `请输入路由名称`,
      default: name,
    },
    {
      name: "id",
      type: "input",
      message: `请输入菜单id`,
      default: parseInt(Math.random() * 100),
    },
    {
      name: "type",
      type: "input",
      message: `请输入菜单类型`,
      default: 2,
    },
    {
      name: "icon",
      type: "input",
      message: `请输入图标名`,
      default: "HomeFilled",
    },
  ]);
  const targetPath = path.resolve("src/router", "config.js");
  const file = fs.readFileSync(targetPath).toString();

  const exp = /(menus[\s\S]*)(\];)/;
  const newFile = file.replace(
    exp,
    `$1
 {
    name:"${res.name}",
    id:"${res.id}",
    type:${res.type},
    icon:"${res.icon}",
    path:"/${routerPath}/${name}"
  },
];`,
  );
  fs.writeFileSync(targetPath, newFile);
};
module.exports = {
  createProjectAction,
  addComponentAction,
  addRouterAction,
  addRCAction,
  testAction,
  addCRUD,
};
