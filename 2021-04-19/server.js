const express = require('express');
const fs = require('fs');
const app = express();
const { readFile, writeFile } = require('./fsUtil')

let fileName = './datas.json'

//app.use(express.static('web'));

app.get('/deleteUser', async (req, res) => {
    
    let id =  parseInt(req.query.id, 10);
    let data = await readFile(fileName); //字串
    let dataJSON = JSON.parse(data);

    for (let i = 0; i < dataJSON.length; i++){
        if (dataJSON[i].Id === id){
            dataJSON.splice(i, 1);
        }
    }

    let writeFileSuccess = await writeFile(fileName,JSON.stringify(dataJSON));

    if (writeFileSuccess) {
        res.json({
            resultCode: 0,
            resultMessage: '刪除成功'
        });
    }else{
        res.json({
            resultCode: 1,
            resultMessage: '刪除失敗'
        })
    }
    
    //編輯功能 ↓
    // array.splice(要編輯的索引處, 編輯幾個元素, '編輯內容');
});


app.get('/getUserList', async (req, res) => {

    let pageIndex = parseInt(req.query.pageIndex, 10); //pageIndex、 pageSize 字串
    let pageSize = parseInt(req.query.pageSize, 10);  // 要轉成int，不然四則運算可能會錯
    let selectKeyWord = req.query.selectKeyWord;

    let resDatas = await getUserList(pageIndex, pageSize, selectKeyWord);

    res.json(resDatas);
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
        seleList = dataJSON.filter(data=>{
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



