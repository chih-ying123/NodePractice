const fs = require("fs");
const path = require('path');
const jwt = require('jsonwebtoken');
const { v4 } = require('uuid');
const crypto = require('crypto');

// 調用API前先檢查登入狀態 (中間件)
async function checkLoginForAPI(req, res, next) {
    try {

        let _token = req.get('token') || '';
        let data = await common.jwtVerify(_token);

        if (data.ip !== req.ip) { //簽出去的token載體，要包含ip，不然會gg								
            res.json(resultMessage(-1, 'IP變動，請重新登入'));
        }
        else {
            req.userData = data;
            next();
        }
    }
    catch (err) {
        //log('checkLoginFail.txt', err.stack);
        res.json(resultMessage(-1, '請重新登入'));
    }
}

function resultMessage(resultCode, resultMessage, result) {
    return {
        resultCode
        , resultMessage
        , result
    }
}

function _tokenPrivateKey() {
    let tokenPrivateKey = crypto.randomBytes(64).toString('hex');
    console.log(tokenPrivateKey);
}

function MD5(plaintext) {
    const cipher = crypto.createHash('md5');
    let dist = cipher.update(plaintext, 'utf8').digest("hex");
    return dist;
}

function uuidv4() {

    return v4(); // ⇨ '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'
}

function jwtSign(data) {

    return new Promise((resolve, reject) => {

        let { tokenPrivateKey } = getConfig();
        jwt.sign(
            data
            , tokenPrivateKey
            , {
                algorithm: 'HS256'
                , expiresIn: 60 * 60   // 【seconds】 這裡 60 * 60 = 1h
            }
            , function (err, token) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(token);
                }
            }
        );
    });
}

function jwtVerify(token) {

    let { tokenPrivateKey } = getConfig();

    return new Promise((resolve, reject) => {

        jwt.verify(token, tokenPrivateKey, function (err, decoded) {
            if (err) {
                reject(err);
            }
            else {
                resolve(decoded);
            }
        });

    });
}

function getConfig() {

    const configPath_prod = path.join(process.cwd(), 'config.prod.json');
    const configPath_dev = path.join(process.cwd(), 'config.dev.json');

    let configStr = '';

    try {
        configStr = fs.readFileSync(configPath_prod, 'utf-8');
    }
    catch (err) {

        try {
            configStr = fs.readFileSync(configPath_dev, 'utf-8');
        }
        catch (err) {
            log('config.err.txt', '讀取環境設定失敗');
        }
    }

    return JSON.parse(configStr);
}

function log(fileName, text) {

    const logPath = path.join(process.cwd(), 'log', fileName); // 通通寫到log資料夾中
    fs.appendFile(logPath, `${getYYYYMMDDhhmmss()}\r\n\t${text}\r\n`, "utf8", err => {

        if (err) {
            console.log('寫日誌失敗，哭哭');
        }
    });
}

function getYYYYMMDDhhmmss(_date) {

    /*
        console.log(new Date().toTimeString());
        console.log(new Date().toUTCString());
        console.log(new Date().toISOString());
    */

    _date = _date || new Date();
    let year = _date.getFullYear();
    let month = String(_date.getMonth() + 1); // month value: 0(一月) ~ 11(十二月)
    let date = String(_date.getDate());
    let hour = String(_date.getHours());
    let min = String(_date.getMinutes());
    let second = String(_date.getSeconds());

    if (Number.parseInt(month) < 10) {
        month = `0${month}`;
    }

    if (Number.parseInt(date) < 10) {
        date = `0${date}`;
    }

    if (Number.parseInt(hour) < 10) {
        hour = `0${hour}`;
    }

    if (Number.parseInt(min) < 10) {
        min = `0${min}`;
    }

    if (Number.parseInt(second) < 10) {
        second = `0${second}`;
    }

    return `${year}-${month}-${date} ${hour}:${min}:${second}`;
}

function dateSplitByMin(date, min) {
    // date 是一個 yyyy-MM-dd 的字串
    let y = date.slice(0, 4);	// 不含end => 0 1 2 3 = yyyy 
    let m = date.slice(5, 7);	// 不含end => 5 6     = MM
    let d = date.slice(8, 10);	// 不含end => 8 9     = dd

    let count = (24 * 60) / min; // 算出一天全部有多少分鐘，再除掉min，得到迴圈計數器(以秒為單位)

    let list = [];
    for (let i = 0; i < count; i++) {
        // new Date(year, month, day, hour, minutes, seconds, milliseconds);
        let year = parseInt(y, 10);
        let month = parseInt(m, 10);
        let day = parseInt(d, 10);

        let start = new Date(year, month - 1, day, 0, 0, 0, 0);
        let end = new Date(year, month - 1, day, 0, 0, 0, 0);

        start.setSeconds(start.getSeconds() + i * min * 60);       // setSeconds 沒傳回新的實例哦
        end.setSeconds(end.getSeconds() + (i + 1) * min * 60 - 1); // setSeconds 沒傳回新的實例哦

        list.push({
            start: getYYYYMMDDhhmmss(start),
            end: getYYYYMMDDhhmmss(end)
        });
    }

    return list;
}

function getPagination(totalRows, pageSize, currentPage, listSize) {

    let totalPages = 0; //總頁數
    let startPage = 0;
    let endPage = 0;


    //計算總頁數
    if (totalRows === 0) {
        totalPages = 1;
    } else if (totalRows % pageSize == 0) {
        totalPages = totalRows / pageSize;
    } else {
        /*取地板值*/
        totalPages = Math.floor(totalRows / pageSize) + 1; //Math.floor() 回傳小於等於所給數字的最大整數
    }

    //防呆: 當前頁次超出總頁數
    if (currentPage > totalPages) {
        currentPage = totalPages;
    }

    if (totalPages <= listSize) {
        startPage = 1;
        endPage = totalPages;
    } else {

        startPage = currentPage - (listSize / 2) + 1;
        endPage = currentPage + (listSize / 2);

        if (startPage < 1) {
            startPage = 1;
            endPage = listSize;
        }

        if (endPage > totalPages) {
            endPage = totalPages;
            startPage = totalPages - (listSize - 1);
        }
    }

    let prePage = currentPage - 1 <= 0 ? 1 : currentPage - 1;
    let nextPage = currentPage + 1 > totalPages ? totalPages : currentPage + 1;

    return {
        currentPage
        , startPage
        , endPage
        , prePage
        , nextPage
    };

}

function delay(s) {
    return new Promise(resolve =>
        setTimeout(resolve, s * 1000)
    );
}

// 私有屬性命名以 _開頭, 不export
module.exports = {
    getConfig
    , log
    , jwtSign
    , jwtVerify
    , uuidv4
    , getYYYYMMDDhhmmss
    , dateSplitByMin
    , delay
    , resultMessage
    , getPagination
}



/*
    登入成功後存下token: localStorage.setItem('token', token);

    fetch(url
        , {
            headers: {
                'content-type': 'application/json'
                , 'token': localStorage.getItem('token')
            }
            , body: JSON.stringify(data)
        }
    );
*/
