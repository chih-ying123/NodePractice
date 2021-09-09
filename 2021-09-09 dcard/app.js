const express = require('express');
const app = express();

app.use(express.static('./web'));
//app.use(express.urlencodeed({ extended: flase}));
app.use(express.json());

app.use('/', require('./modules/user.router'));

app.listen(3000)