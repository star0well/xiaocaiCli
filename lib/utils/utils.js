const path = require("path");
const fs = require("fs");
const ejs = require("ejs");
const { promisify } = require("util");

const compile = (templateName, data) => {
  const templatePosition = `../templates/${templateName}`;
  const templatePath = path.resolve(__dirname, templatePosition);

  return new Promise((resolve, reject) => {
    ejs.renderFile(templatePath, { data }, {}, (err, result) => {
      if (err) {
        console.log(err);
        reject(err);
        return;
      }

      resolve(result);
    });
  });
};

// source/components/category/why
const createDirSync = (pathName) => {
  if (fs.existsSync(pathName)) {
    return true;
  } else {
    if (createDirSync(path.dirname(pathName))) {
      fs.mkdirSync(pathName);
      return true;
    }
  }
};
// 判断path是否存在, 如果不存在, 创建对应的文件夹

const writeToFile = async (path, content) => {
  if (fs.existsSync(path)) {
    return Promise.reject();
  } else {
    return fs.promises.writeFile(path, content);
  }
};

module.exports = {
  compile,
  writeToFile,
  createDirSync,
};
