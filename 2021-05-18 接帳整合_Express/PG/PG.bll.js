const moment = require('moment');
const config = require('./PG.config');
const fetch = require('node-fetch');

async function getBetData(startTime, endTime){

    let postBodyString = await createPOSTBodyString(startTime, endTime);

    let fetchOptions = {
        headers: {'content-Type':'application/x-www-form-urlencoded'}
        , method: 'post'
        , body: postBodyString
    };

    try{
        let response = await fetch(`${config.apiDomain}/${config.api}`, fetchOptions);
        let jsonData = await response.json();
        return jsonData;
        //console.log(jsonData);
        
    }
    catch(err){
        reject(err);
    }
    


};

async function createPOSTBodyString(from_time,to_time){

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

    return postBodyStr;
};

module.exports = {
    getBetData
};