const fs = require("fs");  
const path = require("path");  
let MKDIRS = {}
// 递归创建目录 异步方法  
MKDIRS.async = (dirname, callback) => {  
    fs.exists(dirname, function (exists) {  
        if (exists) {  
            callback();  
        } else {  
            MKDIRS.async(path.dirname(dirname), function () {  
                fs.mkdir(dirname, callback);  
                //console.log('在' + path.dirname(dirname) + '目录创建好' + dirname  +'目录');
            });  
        }  
    });  
}  
// 递归创建目录 同步方法
MKDIRS.sync = (dirname) => {
    if (fs.existsSync(dirname)) {
      return true;
    } else {
      if (MKDIRS.sync(path.dirname(dirname))) {
        fs.mkdirSync(dirname);
        return true;
      }
    }
}
module.exports = MKDIRS