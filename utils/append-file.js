const fs = require("fs"); 
const chalk = require('chalk');
//写入数据
let appendFile = (data, file) => {
    fs.appendFile(file, data, {},function(err){
        if(err){
            console.log(chalk.red(`interface文件写入失败    ${file}`))
        }else{
            //console.log(chalk.green(`interface文件写入成功    ${file}`));
        }
   }) 
}

module.exports = appendFile;
