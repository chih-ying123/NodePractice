const express = require('express');
const fs = require('fs');
const app = express();
const { readFile, writeFile } = require('./fsUtil')

let fileName = './datas.json'

/*
    server端處理請求的結果要傳出去給網頁端 用( resultCode, resultMessage, Datas) 包裝
    這樣網頁端才知道怎麼反應
*/
function resultMessage( resultCode, resultMessage, Datas ){
    return {
        resultCode, resultMessage, Datas
    }
}


app.get('/deleteUser', async (req, res) => {
    
    let id =  parseInt(req.query.id, 10);
    if (isNaN(id)){ 
        return res.json(resultMessage(1,'id請輸入數字',''))
    }

    let data = await readFile(fileName); //字串
    let dataJSON = JSON.parse(data);

    for (let i = 0; i < dataJSON.length; i++){
        if (dataJSON[i].Id === id){
            dataJSON.splice(i, 1);
        }
    }

    let writeFileSuccess = await writeFile(fileName,JSON.stringify(dataJSON));

    if (writeFileSuccess) {
        res.json(resultMessage( 0, '刪除成功', '' ));
    }
    else{
        res.json(resultMessage( 1, '刪除失敗', '' ));
    }
    
    //編輯功能 ↓
    // array.splice(要編輯的索引處, 編輯幾個元素, '編輯內容');
});

app.get('/getUserList', async (req, res) => {

    let pageIndex = parseInt(req.query.pageIndex, 10); //pageIndex、 pageSize 字串
    let pageSize = parseInt(req.query.pageSize, 10);  // 要轉成int，不然四則運算可能會錯

    //請求進來的參數要做防呆，防止使用者輸入錯誤內容
    if (isNaN(pageIndex)){ //NaN -> Not a Number表示非數值, isNaN()判斷是否為非數值
        console.log('rrr');
        return res.json(resultMessage(1,'pageIndex請輸入數字',''))
    }
    if (isNaN(pageSize)){ 
        console.log('rrr');
        return res.json(resultMessage(1,'pageSize請輸入數字',''))
    }

    let selectKeyWord = req.query.selectKeyWord;

    let resDatas = await getUserList(pageIndex, pageSize, selectKeyWord);

    res.json(resultMessage(0,'', resDatas));
});

app.get('/', async (req, res) => {
    res.sendFile(__dirname + "/" + "userList.html");
});



async function getUserList(pageIndex, pageSize, selectKeyWord) {
    let data = await readFile(fileName); //字串
    let dataJSON = JSON.parse(data);
    let listSize = 4;

    let seleList = [];
    if (selectKeyWord !== ''){
        
        var re = new RegExp(selectKeyWord);
        seleList = dataJSON.filter(data=>{ //filter() 回傳陣列，條件 return後方為true的物件
            return re.test(data.Memo)
        })

    }
    else{
        seleList = dataJSON;
    }

    let startRow = pageSize * (pageIndex - 1);
    let endRow = (pageSize - 1) + pageSize * (pageIndex - 1);

    if (startRow < 0){
        startRow = 0;
    }
    if (endRow >= seleList.length){
        endRow = seleList.length-1;
    }

    let userList = [];
    for (var i = startRow; i <= endRow; i++) {

        userList.push(seleList[i]);
    }

    let pageInfo = await getPagination(seleList.length, pageSize, pageIndex, listSize);
    return {userList, pageInfo};
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

        startPage = currentPage - (listSize / 2)+1 ;
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

app.listen(3000);



