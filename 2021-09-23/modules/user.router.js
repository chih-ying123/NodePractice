const express = require('express');
const router = express.Router();
const bll = require('./user.bll');
const { resultMessage } = require('../common');

router.get('/', function(req, res) {
    res.redirect('/article_list.html')
});

router.post('/member/join', async function(req, res) {

    let { email, username, password } = req.body;
    if (typeof email === 'undefined' || email.length === 0 ){
        res.json(resultMessage(1, '請輸入email'))
    }
    else if (typeof username === 'undefined' || username.length === 0 ){
        res.json(resultMessage(1, '請輸入暱稱'))
    }
    else if (typeof password === 'undefined' || password.length === 0 ){
        res.json(resultMessage(1, '請輸入密碼'))
    }
    else {
        let memberJoinMessage = await bll.memberJoin( email, username, password );
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
        let memberLoginMessage = await bll.memberLogin( email, password );
        if ( memberLoginMessage.resultCode === 0 ){
            let username = memberLoginMessage.result.Username;
            let userId = memberLoginMessage.result.Id;
            req.session.username = username;
            req.session.userId = userId;

            res.json(memberLoginMessage);
        }
        else {
            res.json(memberLoginMessage);
        }
        
    }
    
});

router.get('/member/signout', async function(req, res) {
    req.session.userId = undefined;
    req.session.username = undefined;
    res.json(resultMessage(0, '已登出'));

});

router.get('/member/info', async function(req, res) {

    if ( req.session.username ) {
        let username = req.session.username;
        res.json(resultMessage(0, '已登入', { username: username }));
    }
    else {                         
        res.json(resultMessage(1, '請先登入'));
    }
    
});




module.exports = router;