
const chalk = require('chalk');
const path = require("path");
const appendFile = require('./append-file');
const {initRequest, request} = require('./request')
const Utils = require('./util');
let Config = {}

//拼接interface
function getInterfaceArr(data){
    if(data && data.data instanceof Array){
        data.name = Utils.keywordFormat(Utils.deleteSpecialChar(data.name));
        data.data.sort((a, b) => {
            return a.name.toUpperCase() > b.name.toUpperCase() ? 1 : -1
        })//按照字母顺序排序
        let arr = [`/* ${Utils.deleteSpace(data.description)} */`, `interface ${data.name} {`]
        if(data.data.length){
            data.data.map( item => {
                if(item.name && (item.typeName || item.type)){
                    item.name = Utils.keywordFormat(Utils.deleteSpecialChar(item.name));
                    arr.push(`    ${item.name}${item.required ? '' : '?'}: ${item.typeName ? Utils.typeNameFormat(item.typeName) : Utils.getIdName(item.type) + ''}${item.isArray ? '[]' : ''}; //${Utils.deleteSpace(item.description.substring(0,100))}`)
                } else if(!item.name && item.typeName){
                    arr.push(`    ${item.typeName}${item.required ? '' : '?'}: ${item.typeName}${item.isArray ? '[]' : ''}; //${Utils.deleteSpace(item.description.substring(0,100))}`)
                } else {
                    console.log(chalk.hex('#82e0d0')(`    warning：interface为 ${data.name} 的接口声明内缺少 name or type，请确认nei数据是有有误`))
                }
            })
        } else {
            arr.push(`    [propName: string]: any; //此项未定义，默认为any`)
        }
        arr.push(`}`)
        return arr
    } else {
        return []
    }
}

let projectDescription = ''//获取当前项目的基础信息
async function getProjectInfo(){
    let res = await request('3api/projects', { data: {pgid: Config.PROJECT_ID}})
    if(!res){
        return false
    }
    projectDescription = [`/*`, `项目名称：${res.result.name}`,`projectId：${res.result.id}`,`*/`].join('\r\n')
}
let ALL_INTERFACES = []
//获取项目所有的接口信息
async function getInterfaces(){
     let res = await request('3api/interfaces/', {data: {pid: Config.PROJECT_ID}})
     if(!res){
         return false
     }
     let interfaces = res.result
     interfaces.map((item) => {
         getInterfaceById(item.id)
     })
    
}
//获取某个ajax接口的入参和返回
async function getInterfaceById(id) {
    let res = await request('3api/interfaces/' + id)
    if(!res){
        return false
    }
    let interfaceById = res.result
    let params = interfaceById.params
    interfaceById.interfaceName = interfaceById.path.split('/').slice(-1) + interfaceById.id

    let arr = [`\r\n/*`,`接口名：${interfaceById.name}`, `url：${interfaceById.path}`, `方法：${interfaceById.method}`,'*/', ``]//.join('\r\n')
    let input_arr = getInterfaceArr({
        name: `${interfaceById.interfaceName}Args`,
        description: `${interfaceById.path}接口的入参`,
        data: params.inputs
    })
    let out_arr = getInterfaceArr({
        name: `${interfaceById.interfaceName}`,
        description: `${interfaceById.path}接口的反回`,
        data: params.outputs
    })
    arr = arr.concat(input_arr, out_arr)
    //拼接着写入
    appendFile(arr.join('\r\n'), Config.TYPES_DIST + '/' + Config.TYPES_NAME1)

}
//获取项目的所有数据模型
async function getDataTypes(){
    let res = await request('3api/datatypes/', { data: {pid: Config.PROJECT_ID} })
    if(!res){
        return false
    }
    let datatypes = [];
    let error_arr = [];
    res.result.map(item => {
        item.name = item.name || Utils.getIdName(item.id)
        if(item.name){
            if(!Config.BASE_TYPES[item.name]){//基础类型不用写
                datatypes.push(item)
            }
        } else {
            error_arr.push(item) 
        }
    });
    datatypes.sort((a, b) => {
        return a.name.toUpperCase() > b.name.toUpperCase() ? 1 : -1
    });
    
    let arr = [`/*`,`所有数据模型`,'*/', ``]
    datatypes.map( item => {
        let tmp_arr = getInterfaceArr({
            name: item.name,
            description: Utils.deleteSpace(item.description),
            data: item.params
        })
        arr = arr.concat(tmp_arr)
    });
    if(error_arr.length){
        console.log(chalk.hex('#82e0f9')(`    warning：在本项目的数据模型中，共有${error_arr.length}条数据缺少name值，无法生成interface，请确认哦！`))
    }
    appendFile(arr.join('\r\n'), Config.TYPES_DIST + '/' + Config.TYPES_NAME2)
}

let getNeiData = (config) => {
    Config = config
    initRequest(Config)
    //getProjectInfo()
    getInterfaces()
    getDataTypes()
}
module.exports = getNeiData;
