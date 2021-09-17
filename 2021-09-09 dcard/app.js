const express = require('express');
const app = express();
const session = require('express-session');

app.use(express.static('./web'));
app.use(express.urlencoded({ extended: false}));
app.use(express.json());

app.use('/', require('./modules/user.router'));

app.listen(3000);

app.use(session({
    secret: 'login check',
    resave: true,
    saveUninitialized: true
}));