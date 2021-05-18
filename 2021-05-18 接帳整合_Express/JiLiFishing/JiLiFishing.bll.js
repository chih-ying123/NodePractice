const moment = require('moment');
const config = require('./JiLiFishing.config');
const { MD5 } = require('../common');
const fetch = require('node-fetch');
const { v1: uuidV1 } = require('uuid');

//https://momentjs.com/docs/#/parsing/string-format/


/*

    {
        API_URI: 'https://wb-api.jlfafafa2.com/api1/',
        API_SECRET_KEY: '3498e51d098fefd81ff696f8a0a42271be0a8259',
        API_AgentId: 'Winner_Single_VI'
    }

*/

function generateKey(startDateTime, endDateTime, pageIndex, pageSize) {

    //最後驗證小透寫這行是對的, 一定是文件哪邊讓我誤解了
    let now = moment().utc().subtract(4, "h").format("GGMMD");
    let keyG = MD5(`${now}${config.API_AgentId}${config.API_SECRET_KEY}`);
    let queryString = `StartTime=${startDateTime}&EndTime=${endDateTime}&Page=${pageIndex}&PageLimit=${pageSize}&AgentId=${config.API_AgentId}`;
    let md5string = MD5(`${queryString}${keyG}`);
    let randomText1 = uuidV1().replace(/-/g, '').substr(6, 6);
    let randomText2 = uuidV1().replace(/-/g, '').substr(6, 6);

    console.log(randomText1, randomText2);
    let key = randomText1 + md5string + randomText2;
    return key;
}

async function getBetData(startDateTime, endDateTime, pageIndex, pageSize) {

    let result = await callAPI(startDateTime, endDateTime, pageIndex, pageSize);

    // todo : 例外處理
    // 分頁處理
    // 把資料回寫到資料庫中
    return result;
}

function callAPI(startDateTime, endDateTime, pageIndex, pageSize) {

    // 煩死 時間要加T '2020-09-02T00:00:00';
    startDateTime = startDateTime.replace(' ', 'T');
    endDateTime = endDateTime.replace(' ', 'T');
    console.log(startDateTime, endDateTime);

    return new Promise(async (resolve, reject) => {

        let postBody = {
            "AgentId": config.API_AgentId,
            "Key": generateKey(startDateTime, endDateTime, pageIndex, pageSize),
            "StartTime": startDateTime,
            "EndTime": endDateTime,
            "Page": pageIndex,
            "PageLimit": pageSize,
            "GameId": "",
            "FilterAgent": "1"
        }

        let postBodyArray = [];
        for (let key in postBody) {
            postBodyArray.push(`${key}=${postBody[key]}`);
        }
        let postBodyStr = postBodyArray.join('&');

        let url = `${config.API_URI}GetFishBetRecordByTime`;

        let fetchOptions = {
            'method': 'POST',
            'headers': {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: postBodyStr
        }
        try {
            let res = await fetch(url, fetchOptions);
            let json = await res.json();
            resolve(json);
        }
        catch (err) {
            reject(err);
        }
    });
}

/*
let startDateTime = '2021-05-01 12:00:00'
let endDateTime = '2021-05-01 12:59:59'
let pageIndex = 1;
let pageSize = 1000;

let postBody = {
    "AgentId": config.API_AgentId,
    "Key": generateKey(startDateTime, endDateTime, pageIndex, pageSize),
    "StartTime": startDateTime,
    "EndTime": endDateTime,
    "Page": pageIndex,
    "PageLimit": pageSize,
    "GameId": "",
    "FilterAgent": "1"
}

let postBodyArray = [];
for (key in postBody) {
    postBodyStr.push(`${key}=${postBody[key]}`)
}
let postBodyStr = postBodyArray.join('&');
*/

module.exports = {
    getBetData
}