const express = require('express');
const router = express.Router();
const bll = require('./user.bll');
const { resultMessage } = require('../common')

router.get('/', function(req, res) {
    res.redirect('/member_join.html')
});

router.post('/member/join', async function(req, res) {

    let { email, password } = req.body;
    if (typeof email === 'undefined' || email.length === 0 ){
        res.json(resultMessage(1, '請輸入email'))
    }
    if (typeof password === 'undefined' || password.length === 0 ){
        res.json(resultMessage(1, '請輸入密碼'))
    }
    
    let memberJoinMessage = await bll.memberJoin( email, password );
    res.json(memberJoinMessage);
    
});

router.post('/member/login', async function(req, res) {

    
    let { email, password } = req.body;
    if (typeof email === 'undefined' || email.length === 0 ){
        res.json(resultMessage(1, '請輸入email'))
    }
    if (typeof password === 'undefined' || password.length === 0 ){
        res.json(resultMessage(1, '請輸入密碼'))
    }
    
    let memberLoginMessage = await bll.memberLogin( email, password );
    res.json(memberLoginMessage);
    
});

module.exports = router;