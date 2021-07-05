const express = require('express');
const app = express();

app.use(express.static('./web'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//加載路由
app.use('/cg', require('./cg/cg.router'));

app.listen(3000);