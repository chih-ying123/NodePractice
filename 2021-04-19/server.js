const express = require('express');
const fs = require('fs');
const app = express();
const { readFile } = require('./fsUtil')

let fileName = './datas.json'

//app.use(express.static('web'));

app.get('/getUserList', async (req, res) => {

    let pageIndex = parseInt(req.query.pageIndex, 10); //pageIndex、 pageSize 字串
    let pageSize = parseInt(req.query.pageSize, 10);  // 要轉成int，不然四則運算可能會錯
    let listSize = 4;

    //console.log(typeof pageIndex);
    //console.log(typeof pageSize);

    let {userList, totalRows} = await getUserList(pageIndex, pageSize);
    let pageInfo = await getPagination(totalRows, pageSize, pageIndex, listSize)

    let resDatas = {userList, pageInfo};

    res.json(resDatas);
});

app.get('/', async (req, res) => {
    res.sendFile(__dirname + "/" + "userList.html");
});

async function getUserList(pageIndex, pageSize) {
    let data = await readFile(fileName); //字串
    let dataJSON = JSON.parse(data);
    let totalRows = dataJSON.length;

    let startRow = pageSize * (pageIndex - 1);
    let endRow = (pageSize - 1) + pageSize * (pageIndex - 1);

    if (startRow < 0){
        startRow = 0;
    }
    if (endRow >= totalRows){
        endRow = totalRows-1;
    }

    let userList = [];
    for (var i = startRow; i <= endRow; i++) {
        userList.push(dataJSON[i]);
    }

    return {userList, totalRows};
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



