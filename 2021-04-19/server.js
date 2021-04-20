const express = require('express');
const fs = require('fs');
const app = express();
const { readFile } = require('./fsUtil')

let fileName = './datas.json'

//app.use(express.static('web'));

app.get('getUserList', async (req, res) => {

    //回應資料給網頁
    // 處理請求參數: pageIndex, pageSize

    /*
        let data = await readFile(fileName)
        let dataJSON = JSON.parse(data)

        console.log(dataJSON[0]);
    */

});

app.get('/', async (req, res) => {

    res.sendFile(__dirname + "/" + "userList.html");
    console.log(req.path);


});



app.listen(3000);



