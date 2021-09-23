const express = require('express');
const app = express();
const session = require('express-session');
//參考: https://ithelp.ithome.com.tw/articles/10187464
// https://medium.com/johnny%E7%9A%84%E8%BD%89%E8%81%B7%E5%B7%A5%E7%A8%8B%E5%B8%AB%E7%AD%86%E8%A8%98/node-js-cookie-session%E9%A9%97%E8%AD%89%E5%8E%9F%E7%90%86%E4%BB%A5%E5%8F%8Aexpress-session%E5%A5%97%E4%BB%B6%E4%BD%BF%E7%94%A8-aeafa386837e


app.use(session({
    secret: 'login check',
    resave: false,
    saveUninitialized: true,
    //cookie: { maxAge: 600 * 1000 } //10分鐘到期
   
  }));


app.use(express.static('./web'));
app.use(express.urlencoded({ extended: false}));
app.use(express.json());

app.use('/', require('./modules/user.router'));


app.listen(3000);
