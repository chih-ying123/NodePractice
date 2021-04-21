const express = require('express');
const fs = require('fs');
const app = express();
const { readFile } = require('./fsUtil')

let fileName = './datas.json'

//app.use(express.static('web'));

app.get('/getUserList', async (req, res) => {

    let pageIndex = parseInt(req.query.pageIndex, 10); //pageIndex、 pageSize 字串
    let pageSize = parseInt(req.query.pageSize, 10);  // 要轉成int，不然四則運算可能會錯

    //console.log(typeof pageIndex);
    //console.log(typeof pageSize);
    
    let  userList = await getUserList(pageIndex, pageSize);
    let totalpage = await totalPage(pageSize);
    let resDatas =[userList, totalpage]
    //console.log(resDatas);

    res.json(resDatas);
});

app.get('/', async (req, res) => {
    res.sendFile(__dirname + "/" + "userList.html");
});

async function getUserList(pageIndex, pageSize) {
    let data = await readFile(fileName); //字串
    let dataJSON = JSON.parse(data);

    let startRow = pageSize * (pageIndex - 1);
    let endRow = (pageSize - 1) + pageSize * (pageIndex - 1);

    if (startRow < 0){
        startRow = 0;
    }

    if (endRow >= dataJSON.length){
        endRow = dataJSON.length-1;
    }

    let data2 = [];

    for (var i = startRow; i <= endRow; i++) {
        data2.push(dataJSON[i]);
    }
    return data2;
}

async function totalPage(pageSize){

    let data = await readFile(fileName); //字串
    let dataJSON = JSON.parse(data);

    let totalRows = dataJSON.length;

    let totalpage = Math.ceil(totalRows/pageSize) ;
    return totalpage;

}

app.listen(3000);



