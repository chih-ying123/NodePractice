
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

async function callAPI(startTime, endTime){

    return new Promise(async (resolve, reject) => {

        let dataObject = {
            "startTime": startTime.replace(' ', 'T') + '.000+08:00',
            "endTime": endTime.replace(' ', 'T') + '.000+08:00',
            "method":"data"
            };
        let dataString = JSON.stringify(dataObject);    
        let key = config.key;
        let iv = config.iv;
        let afterEncrypted = aes256Cryto.Encrypt(dataString, key, iv);

        let fetchOptions = {
            headers: {'content-Type':'application/x-www-form-urlencoded'}
            , method: 'post'
            , body:  `channelId=${config.channelId}&data=${afterEncrypted}`
        };
        try {
            let response = await fetch(`${config.apiURI}`, fetchOptions);
            let jsonData = await response.text();
            console.log(jsonData);

            let afterDecrypted = aes256Cryto.Decrypt( jsonData, key, iv);
            let datas =  JSON.parse(afterDecrypted);

            console.log(datas);
            resolve (datas);
        }
        catch (err) {
            reject(err);
        }
    });
};

module.exports = {
    getBetData
};