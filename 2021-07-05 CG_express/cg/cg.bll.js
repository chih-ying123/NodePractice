
const fetch = require('node-fetch');
const aes256Cryto = require("../aes256Encryption");
const config = require('./cg.config');
const { URLSearchParams } = require('url');

async function getBetData(startTime, endTime) {

    let result = await callAPI(startTime, endTime);

    // todo : 例外處理
    // 分頁處理
    // 把資料回寫到資料庫中
    return result;

};

async function callAPI(startTime, endTime) {

    return new Promise(async (resolve, reject) => {

        //2018-06-24T00:00:00.646+01:00


        startTime = startTime.replace(' ', 'T') + '.000+08:00'
        endTime = endTime.replace(' ', 'T') + '.999+08:00'
        let dataObject = {
            "startTime": startTime,
            "endTime": endTime,
            "method": "data"
        };

        let dataString = JSON.stringify(dataObject);

        let key = config.key;
        let iv = config.iv;
        let afterEncrypted = aes256Cryto.Encrypt(dataString, key, iv);
        console.log('參數明文:' + dataString);
        console.log('參數密文:' + afterEncrypted);


        const params = new URLSearchParams();
        params.append('channelId', config.channelId);
        params.append('data', afterEncrypted);

        let fetchOptions = {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            , method: 'POST'
            , body: params
        };
        try {
            let response = await fetch(`${config.apiURI}`, fetchOptions);
            let textData = await response.text();
            console.log(textData);

            let afterDecrypted = aes256Cryto.Decrypt(textData, key, iv);
            let datas = JSON.parse(afterDecrypted);
            resolve(datas);
        }
        catch (err) {
            reject(err);
        }
    });
};

module.exports = {
    getBetData
};