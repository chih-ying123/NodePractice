const express = require('express');
const router = express.Router();
const bll = require('./user.bll');
const { resultMessage } = require('../common');
const session = require('express-session');

router.get('/', function(req, res) {
    res.redirect('/member_join.html')
});

router.post('/member/join', async function(req, res) {

    let { email, password } = req.body;
    if (typeof email === 'undefined' || email.length === 0 ){
        res.json(resultMessage(1, '請輸入email'))
    }
    else if (typeof password === 'undefined' || password.length === 0 ){
        res.json(resultMessage(1, '請輸入密碼'))
    }
    else {
        let memberJoinMessage = await bll.memberJoin( email, password );
        res.json(memberJoinMessage);
    }
});

router.post('/member/login', async function(req, res) {

    let { email, password } = req.body;
    if (typeof email === 'undefined' || email.length === 0 ){
        res.json(resultMessage(1, '請輸入email'))
    }
    else if (typeof password === 'undefined' || password.length === 0 ){
        res.json(resultMessage(1, '請輸入密碼'))
    }
    else{
        // session 
        // 參考: https://www.jianshu.com/p/e5a94824e078
        
        let memberLoginMessage = await bll.memberLogin( email, password );

        if ( memberLoginMessage.resultCode === 0) {
            let user = {
                name: email
            }
            req.session.user=user;
            res.redirect('/member_info.html')
        }
        else {
            res.json(memberLoginMessage);
        }
    }
});

router.get('./member_info.html', function(req, res) {
    
    if (res.session.user) {
        let user = req.session.user;
        let name = user.name;
        res.end(`哈囉 ${name}`)
    }
    else {
        res.end('請先登入')
    }
});


module.exports = router;