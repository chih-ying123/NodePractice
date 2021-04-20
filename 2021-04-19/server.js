const express = require('express');
const fs = require('fs');
const app = express();
const { readFile } = require('./fsUtil')

let fileName = './datas.json'

//app.use(express.static('web'));

app.get('/getUserList', async (req, res) => {

    let { pageIndex, pageSize} = req.query
    padeInfo(pageIndex, pageSize);

    
    //回應資料給網頁
    // 處理請求參數: pageIndex, pageSize

    res.send()
});

app.get('/', async (req, res) => {

    res.sendFile(__dirname + "/" + "userList.html");
    console.log(req.path);

});

async function padeInfo(pageIndex, pageSize){
    let data = await readFile(fileName); //字串
    let dataJSON = JSON.parse(data); 

    let startRow = pageSize*(pageIndex-1);
    let endRow = (pageSize-1)+pageSize*(pageIndex-1);

    for (var i=startRow; i<=endRow;i++){
        let {Id, UserName, Memo} = dataJSON[i]
        console.log(Id, UserName, Memo);
    }

}

app.listen(3000);



