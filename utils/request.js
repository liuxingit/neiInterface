const https = require('https');
const chalk = require('chalk');
const path = require("path");
const querystring= require('querystring');
const crypto = require('crypto');
const BufferHelper= require('./buffer-helper');
let Config = {}, baseOptions = {}

let Request = (url, options) => {
    options = options || {}
    options.data = Object.assign(options.data || {}, {platformId: Config.PLATFORM_ID})
    let sign = crypto.createHmac('sha256', Config.SALT).update(querystring.stringify(options.data)).digest('hex')
    Object.assign(options.data, {sign: sign})
    if(options && ((!options.method || options.method === 'GET') && options.data)){
        url += '?' + querystring.stringify(options.data);
        delete options.data
    }
    let params = Object.assign({}, baseOptions, {
        path: '/' + url
    }, options)
    return new Promise(function(resolve, reject){
        const req = https.request(params, (res, req) => {
            // console.log('状态码：', res.statusCode);
            // console.log('响应头：', res.headers);

            let bufferHelper = new BufferHelper()
            res.on('data', function (chunk) {  
                bufferHelper.concat(chunk);  
            });  
            res.on('end', function () {
                if(res.statusCode === 200){
                    let resJSON = JSON.parse(bufferHelper.toBuffer())
                    if(resJSON.code && resJSON.code === 200){
                        resolve(resJSON)
                    } else {
                        reject(resJSON)
                    }
                } else {
                    console.log(chalk.red('httpcode非200 : '+ url))
                    reject({msg: 'http请求fail', code: res.statusCode})
                }
            });  
        });
        req.on('error', (e) => {
            reject({msg: 'request fail', code: res && res.statusCode ? res.statusCode : 201})
        });
        req.end();
    })
}
let request = async (url, options) => {
    try {
        let res = await Request(url, options)
        return res
    } catch(e) {
        console.log(chalk.red(`接口出错---code：${e.code}, msg: ${e.msg}`))
    }
}
let initRequest = (config) => {
    Config = config
    baseOptions = {
        hostname: Config.HOSTNAME,
        method: 'GET'
    }
}

module.exports = {initRequest: initRequest, request: request}