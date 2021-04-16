const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser'); 
const app = express();

let urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use(express.static('web'));

app.post('/POST',urlencodedParser,(req,res)=>{
    let response ={
        username : req.body.username,
        phone : req.body.phone,
        password : req.body.password,
        passwordCheck : req.body.passwordCheck
    }

    fs.readFile(`./web/json/${response.username}.json`,(err)=>{
        if (err!==null){
            fs.writeFile(`./web/json/${response.username}.json`, `${JSON.stringify(response)}`, (err)=>{
                res.send(`<h1>哈囉${response.username} 完成註冊囉~~</h1>`);
            })
        }else{
            res.send('帳號已被使用')
        }
        
    })
    
});

app.listen(3000);