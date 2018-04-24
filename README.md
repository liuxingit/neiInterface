# nei-interface

利用nei内部查询数据接口，获取数据，生成typescript的interface文件

# Usage

npm install nei-interface -g (最好全局安装)

第一种用法：

```
创建项目的 .interfacerc.json文件
{
    "PLATFORM_ID": , //找杭研 nei后端 @包勇明 获取 platformId 
    "SALT": "", //找杭研 nei后端 @包勇明 获取 salt 
    "PROJECT_ID": 0, //nei 页面url 即可获取
    "TYPES_DIST": "./src/javascript/common/interface/" //自己需要生成的types文件的目录 
}

执行 neiI -c .interface.json 命令，自动生成interface文件 // 每次nei定义的接口声明变更都需要运行此命令哦
```


第二种用法
```
在gulpfile.js中配置任务

let neiInterface = require('nei-interface');
let config = require('./.interfacerc.json')

gulp.task('interface', () => {
    neiInterface(config)
});

gulp interface //生成interface文件
```
