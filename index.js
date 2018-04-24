const chalk = require('chalk');
const path = require("path");
const fs = require("fs"); 
const MKDIRS = require('./utils/mkdir');
const getNeiData = require('./utils/nei-data');
let Config = require('./config');

const createInterface = (config) => {
    Object.assign(Config, config)
    //创建路径
    MKDIRS.async(Config.TYPES_DIST, () => {
        fs.createWriteStream(Config.TYPES_DIST + '/' + Config.TYPES_NAME1)
        fs.createWriteStream(Config.TYPES_DIST + '/' + Config.TYPES_NAME2)
        console.log(chalk.green('interface文件创建完毕，开始获取数据并写入……'));
        //获取数据
        getNeiData(Config)
    })
};

module.exports = createInterface;