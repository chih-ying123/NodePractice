const express = require('express');
const app = express();

app.use(express.static('./web'));
app.use(express.urlencoded({ extended: false}));
app.use(express.json());

app.use('/', require('./modules/user.router'));

app.listen(3000)