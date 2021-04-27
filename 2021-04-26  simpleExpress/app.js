/*
    express 只是對原生的http做出功能封裝，方便使用。
*/

const express = require('./simpleExpress');
let app = express();   //express 是一個函式 (一對圓括號調用) 


// 註冊一個路由: 匹配規則 
app.get('/a', function (req, res, next) {

    console.log('1-a');
    //檢查有無登入, 登入成功 才next()，否則就不理它
    next();
});

app.get('/a', function (req, res, next) {
    // 比如驗證權限
    console.log('2-a');
    // next();
});

app.get('/a', function (req, res) {
    console.log('3-a');
    res.end('3-a');  // 這裡不加next， 是因為在這裡有做res.end
});



app.listen(3000, function () {
    console.log('Server start at 3000 port');
});