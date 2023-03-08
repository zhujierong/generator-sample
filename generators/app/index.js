const path = require("path");
const fs = require("fs");
// Generator 核心入口文件

const Generator = require("yeoman-generator");

// // 1.写入文件到项目中
// module.exports = class extends Generator {
//   // 自动在生产文件阶段调用此方法
//   writing() {
//     this.fs.write(this.destinationPath("temp.text"), Math.random().toString());
//   }
// };

// 2.创建模板
// 步骤：
// 1.在app目录中创建templates目录，在里面创建模板文件
// 内部使用 EJS 模板标记输出数据，其他EJS语法也支持 https://ejs.co/
// 例如：
// <%- title %>
// <% if (success) { %>
// 输出内容
// <% } %>
// module.exports = class extends Generator {
//   // 自动在生产文件阶段调用此方法
//   writing() {
//     // 获取模板
//     const templ = this.templatePath("temp.html");
//     // 输出模板的路径
//     const output = this.destinationPath("index.html");
//     // 模板的数据内容
//     const context = { title: this.answers.title, success: true };
//     // 执行copy操作并注入数据内容
//     this.fs.copyTpl(templ, output, context);
//   }
//   // 询问用户、获取用户输入内容
//   prompting() {
//     // 询问的信息
//     return this.prompt([
//       {
//         type: "input",
//         name: "title",
//         message: "title名称",
//         default: this.appname,
//       },
//     ]).then((answers) => {
//       console.log("answers", answers);
//       // 获取用户输入内容
//       this.answers = answers
//     });
//   }
// };

// 3.创建React项目
// 步骤：
// 1.使用React脚手架生成项目
// 2.将React脚手架生成的项目根目录内所有文件复制到 templates 目录中
// 3.针对需要定制化输入的内容使用 ejs 语法进行标注

// 获取所有文件路径
function getFileAll(pathSrc) {
  return recur(pathSrc, pathSrc);
}

function recur(curDir, rootDir) {
  let result = [];
  fs.readdirSync(curDir, { withFileTypes: true }).forEach((fileInfo) => {
    const childPath = path.resolve(curDir, fileInfo.name);
    if (fileInfo.isDirectory()) {
      let re = recur(childPath, rootDir);
      result = re ? result.concat(re) : result;
    } else {
      result.push(childPath.replace(`${rootDir}\\`, ""));
    }
  });
  return result;
}

module.exports = class extends Generator {
  // 询问用户、获取用户输入内容
  prompting() {
    // 询问的信息
    return this.prompt([
      {
        type: "input",
        name: "name",
        message: "your project name",
        default: this.appname,
      },
    ]).then((answers) => {
      // 获取用户输入内容
      this.answers = answers;
    });
  }
  // 自动在生产文件阶段调用此方法
  writing() {
    const rootDir = path.resolve(__dirname, "./templates");
    // 获取templates中所有文件的路径
    let templates = getFileAll(rootDir, rootDir);
    // 拷贝生成
    templates.forEach((item) => {
      this.fs.copyTpl(
        this.templatePath(item),
        this.destinationPath(`${this.answers.name}/${item}`),
        this.answers
      );
    });
  }
};
