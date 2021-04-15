// 安裝express 
// npm install express --save

// 幾個與express一起重要的模塊
/* 
   body-parser ->用於處理JSON, Raw, Text, URL編碼的數據 
   cookie-parser ->解析Cookie, 通過req.cookies可以取得傳過來的cookie, 並轉成對象
   multer ->用于处理enctype="multipart/form-data"（设置表单的MIME编码）的表单数据 ?
*/ 

const express = require('express');
const app = express();
var bodyParser = require('body-parser');

// 创建 application/x-www-form-urlencoded 编码解析
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use(express.static('public'));

app.get('/', function (req, res) {
   res.sendFile( __dirname + "/" + "post.html" );
})

app.post('/POST', urlencodedParser, function (req, res) {

    response = {
        name:req.body.name,
        start:req.body.start,
        end:req.body.end,
        inputString:req.body.inputString
    };
    console.log(response);
    res.end(JSON.stringify(response));
 })


const server = app.listen(3000,function(){

    let host = server.address().address;
    let port = server.address().port;

    console.log('訪問地址為 http://%s:%s',host, port);
});