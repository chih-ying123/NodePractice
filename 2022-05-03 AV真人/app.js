// 所有 API 请求和返回的时区都是 UTC +7。
const md5 = require('md5');
const moment = require('moment');
const crypto = require('crypto'); // 加密包
const http = require('http');

// xml-> json
const { XMLParser } = require("fast-xml-parser"); // npm i fast-xml-parser --save


//-------------------------------------------------------------------------------
let secretKey = '7B6042D89AE84A4185CCEA928F3BCE71';
let md5Key = 'PyUVZbeChU3';
let encryptKey = 'fSemHZiv';
let timeFormat = 'yyyyMMDDHHmmss' // 時間格式: 文件是寫dd，可是對應到moment要用DD
let apiHost1 = 'intg.avapisrv1.com';  // path =  /api/api.aspx
let apiHost2 = 'intg.avapisrv1.net';  // path =  /api/api.aspx
//-------------------------------------------------------------------------------

function desEncrypt(qs) { // DES-CBC 加密函式
    var key = new Buffer.from(encryptKey.substring(0, 8), 'utf8');
    var iv = new Buffer.from(encryptKey.substring(0, 8), 'utf8');
    var cipher = crypto.createCipheriv('des-cbc', key, iv);
    var c = cipher.update(qs, 'utf8', 'base64');
    c += cipher.final('base64');
    return encodeURIComponent(c)  // 相當於 HttpUtility.UrlEncode
    // return c                   // postman 會自己轉
}
function httpPost(q, s) {

    let postData = `q=${q}&s=${s}`;

    const options = {
        hostname: apiHost1,
        port: 80,
        path: '/api/api.aspx',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(postData)
        }
    }

    let promise = new Promise((resolve, reject) => {

        let callBack = function (res) {

            res.setEncoding('utf8');
            let buffer = []; // 網路傳輸不會立即就得到完整的響應結果，用個buffer暫存

            res.on('data', function (chunk) { // 片段資料傳輸到達
                buffer.push(chunk);
            });

            res.on('end', function () { // 資料響應結束
                let result = buffer.join('');
                resolve(result)
            });

            res.on('error', function (err) {
                reject(err)
            });
        }

        let request = http.request(options, callBack);
        request.write(postData);
        request.end();

        request.on('error', function (err) {
            reject(err)
        });
    })

    return promise;
}

async function callAPI_GetAllBetDetailsDV(date) {
    let method = 'GetAllBetDetailsDV';
    let time = moment().format(timeFormat); // 當前時間
    let userName = '';
    let QS = `method=${method}&Key=${secretKey}&Time=${time}&Username=${userName}&Date=${date}`; // query string
    //-------------------------------------
    let q = desEncrypt(QS);  // 加密
    let s = md5(`${QS}${md5Key}${time}${secretKey}`); // 防偽簽章

    console.log(q);
    console.log('\n');
    console.log(s);
    console.log('\n');

    try {
        let xml = await httpPost(q, s);
        console.log(xml)
    } catch (err) {
        // 錯誤日誌可以在這裡記錄，別說找不到
        console.log(`偶臭了: ` + err);
    }
}

//5.3.2
async function callAPI_GetAllBetDetailsForTimeIntervalDV(fromTime, toTime) {

    // fromTime、toTime -1h

    let method = 'GetAllBetDetailsForTimeIntervalDV';
    let time = moment().format(timeFormat); // 當前時間
    let userName = '';
    let QS = `method=${method}&Key=${secretKey}&Time=${time}&Username=${userName}&FromTime=${fromTime}&ToTime=${toTime}`; // query string
    //-------------------------------------
    let q = desEncrypt(QS);  // 加密
    let s = md5(`${QS}${md5Key}${time}${secretKey}`); // 防偽簽章

    // console.log(q);
    // console.log('\n');
    // console.log(s);
    // console.log('\n');

    try {
        let xml = await httpPost(q, s);
        xml = xml.replace('<?xml version="1.0" encoding="utf-8"?>', '')  // 覺得小礙眼， 消掉它
        //console.log(xml);

        const parser = new XMLParser();
        let jObj = parser.parse(xml);

        // 抓的資料:  BetTime+ 1h
        console.log(JSON.stringify(jObj));

    } catch (err) {
        // 錯誤日誌可以在這裡記錄，別說找不到
        console.log(`偶臭了: ` + err);
    }
}

// callAPI_GetAllBetDetailsDV('2022-05-03');
callAPI_GetAllBetDetailsForTimeIntervalDV('2022-05-05 00:00:00', '2022-05-05 23:59:59')

/*
    用node-fetch竟然失敗 => 改用回原生的http模組

    const params = new URLSearchParams();
    params.append('q', q);
    params.append('s', s);

    let fetchOptions = {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        , method: 'POST'
        , body: params
    };

    try {
        let response = await fetch(`${apiBase2}}`, fetchOptions);
        let textData = await response.text();
        console.log(textData);
    }
    catch (err) {
        console.log(err);
    }
*/