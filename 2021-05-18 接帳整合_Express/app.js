const express = require('express');
let app = express();

app.use(express.static('./web'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// 加載路由
app.use('/JiLiFishing', require('./JiLiFishing/JiLiFishing.router'));  // 吉利捕魚
app.listen(3000);