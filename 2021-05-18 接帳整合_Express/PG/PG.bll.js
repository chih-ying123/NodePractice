const moment = require('moment');
const config = require('./PG.config');
const fetch = require('node-fetch');

async function getBetData(startTime, endTime){

    let result = await callAPI(startTime, endTime);

    // todo : 例外處理
    // 分頁處理
    // 把資料回寫到資料庫中
    return result;

};

async function callAPI(from_time,to_time){

    return new Promise(async (resolve, reject) => {

        let postBody = {
            operator_token: config.operator_token
            , secret_key: config.secret_key
            , count: 1500
            , bet_type: 1
            , from_time: 0
            , to_time: 0
        };
        
        postBody.from_time = moment(from_time,config.timeFormat).unix()*1000; //moment可以將時間轉為unix時間
        postBody.to_time = moment(to_time,config.timeFormat).unix()*1000;
        
        let postBodyArray = [];
        
        for(let key in postBody){
            postBodyArray.push(`${key}=${postBody[key]}`);
        }
        let postBodyStr = postBodyArray.join('&');

        let fetchOptions = {
            headers: {'content-Type':'application/x-www-form-urlencoded'}
            , method: 'post'
            , body: postBodyStr
        };
        try {
            let response = await fetch(`${config.apiDomain}/${config.api}`, fetchOptions);
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