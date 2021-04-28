const express = require('express');
let app = express();

// 統一的前置處理流程
app.use(express.static('./web'));         // 靜態資源服務
app.use(express.urlencoded({ extended: false }));       // 解析請求體  => req.body
app.use(express.json());

//加載路由
app.use('/user', require('./modules/user.router'));


app.listen(3000, () => {

    console.log('server start at 3000 port');
});