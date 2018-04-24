// 关于nei 内部查询接口的文档 https://nei.netease.com/project?pid=27248，加入该项目即可看到具体接口信息
const Config = {
    PLATFORM_ID: 0,//找杭研 nei后端 @包勇明 获取 platformId //tip: 自行设置
    SALT: 'abc',//找杭研 nei后端 @包勇明 获取 salt  //tip: 自行设置
    PROJECT_ID: 0, // nei 页面url 即可获取  //tip: 自行设置
    TYPES_DIST: './interfaces', //自己需要生成的types文件的目录  //tip: 自行设置
    TYPES_NAME1: 'project.ts', // 项目接口相关数据模型的interface文件； 
    TYPES_NAME2: 'common.ts',//公共部分数据模型的interface文件
    BASE_TYPES: {
        Number: 'number',
        Boolean: 'boolean',
        String: 'string',
        File: 'any',//需要验证ts是否支持文件类型
        Variable: 'any'//可变类型
    },
    HOSTNAME: 'nei.netease.com'
}
module.exports = Config