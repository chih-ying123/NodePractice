const express = require('express');
const fs = require('fs');
const app = express();
const { readFile } = require('./fsUtil')

let fileName = './datas.json'

//app.use(express.static('web'));

app.get('/getUserList', async (req, res) => {

    let { pageIndex, pageSize } = req.query

    console.log(typeof pageIndex);
    console.log(typeof pageSize);

    //pageIndex、 pageIndex 字串
    let resDatas = await padeInfo(pageIndex, pageSize);


    //回應資料給網頁
    // 處理請求參數: pageIndex, pageSize

    res.json(resDatas);
});

app.get('/', async (req, res) => {

    res.sendFile(__dirname + "/" + "userList.html");
    console.log(req.path);

});

async function padeInfo(pageIndex, pageSize) {
    let data = await readFile(fileName); //字串
    let dataJSON = JSON.parse(data);

    let startRow = pageSize * (pageIndex - 1);
    let endRow = (pageSize - 1) + pageSize * (pageIndex - 1);




    /*
     if (startRow < 0){
        startRow = 0;
    }

    if (endRow >= contentData.length){
        endRow = contentData.length-1;
    }
    */

    let data2 = [];

    for (var i = startRow; i <= endRow; i++) {
        let { Id, UserName, Memo } = dataJSON[i]
        console.log(Id, UserName, Memo);
        data2.push(dataJSON[i]);
    }
    return data2;
}

app.listen(3000);



