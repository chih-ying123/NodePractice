const express = require('express');
const fs = require('fs');
const app = express();
const {readFile} = require('./fsUtil')

let fileName = './datas.json'

//app.use(express.static('web'));

app.get('/',async (req,res)=>{

    res.sendFile( __dirname + "/" + "userList.html" );
    console.log(req.path);
    let data = await readFile(fileName)
    let dataJSON = JSON.parse(data)
    
    console.log(dataJSON[0]);
    
});



app.listen(3000);



