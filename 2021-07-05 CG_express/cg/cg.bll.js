
const fetch = require('node-fetch');
const aes256Cryto = require("../aes256Encryption");
const config = require('./cg.config');

async function getBetData(startTime, endTime){

    let result = await callAPI(startTime, endTime);

    // todo : 例外處理
    // 分頁處理
    // 把資料回寫到資料庫中
    return result;

};

async function callAPI(from_time,to_time){

    return new Promise(async (resolve, reject) => {

        var str = `{
            "startTime":"${from_time.replace(' ', 'T')}";,
            "endTime":"${to_time.replace(' ', 'T')}",
            "method":"data"
            }
            `;
        var key = config.key;
        var iv = config.iv;
        var afterEncrypted = aes256Cryto.Encrypt(str, key, iv);

        let postBody = {
            channelId: config.channelId
            , data: afterEncrypted
        };
       
        let fetchOptions = {
            headers: {'content-Type':'application/x-www-form-urlencoded'}
            , method: 'post'
            , body: postBody
        };
        try {
            let response = await fetch(`${config.apiURI}`, fetchOptions);
            let jsonData = await response.json();
            resolve (jsonData);
        }
        catch (err) {
            reject(err);
        }
    });
};

module.exports = {
    getBetData
};