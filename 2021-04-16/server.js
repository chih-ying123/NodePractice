const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser'); 
const app = express();

let urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use(express.static('web'));

app.post('/register',urlencodedParser, async (req,res)=>{
    /* 
    let response ={
        username : req.body.username,
        phone : req.body.phone,
        password : req.body.password,
        passwordCheck : req.body.passwordCheck
    } 
    可以寫成以下 ↓↓↓ 要熟悉物件用法 
    */
    let {username,phone,password,passwordCheck} =req.body;

    let fileName = './datas/' + username + '.json';
    console.log(fileName);
    
    await fs.exists(fileName, (exists) => {
        console.log(exists ? '存在' : '不存在');
        
        if (exists){

            res.json({
                resultCode: 1,
                resultMessage: '帳號已被使用'
            })
            
        }
        else{
            fs.writeFile(fileName, JSON.stringify({username,phone,password,passwordCheck}),(err)=>{});
            res.json({
                resultCode: 0,
                resultMessage: '帳號註冊成功'
            });
        }

    }); 

    
    
});

app.listen(3000);

/*
不及格

    fs.readFile(`./web/json/${response.username}.json`,(err)=>{
        if (err){
            fs.writeFile(`./web/json/${response.username}.json`, `${JSON.stringify(response)}`, (err)=>{
                res.send(`<h1>哈囉${response.username} 完成註冊囉~~</h1>`);
            })
        }else{
            res.send('帳號已被使用')
        }
        
    })


*/