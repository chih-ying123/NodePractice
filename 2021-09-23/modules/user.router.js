const express = require('express');
const router = express.Router();
const bll = require('./user.bll');
const { resultMessage } = require('../common');
const session = require('express-session');

router.get('/', function(req, res) {
    res.redirect('/member_info.html')
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
        let memberLoginMessage = await bll.memberLogin( email, password );
        if ( memberLoginMessage.resultCode === 0 ){
            req.session.username = email;
            res.json(memberLoginMessage);
        }
        else {
            res.json(memberLoginMessage);
        }
        
    }
});

router.get('/member/info', async function(req, res) {

    if ( req.session.username ) {
        let emailSplit = req.session.username.split('@');
        let username = emailSplit[0];
        res.json(resultMessage(0, '已登入', { username: username }));
    }
    else {                         
        res.json(resultMessage(1, '請先登入'));
    }

});

router.get('/article/class', async function(req, res) {

    let articleClass = await bll.articleClass();
    res.json(articleClass)
});

router.post('/article/add', async function(req, res){

    let { title, article_class, content} = req.body;
    let author = req.session.username;

    if (typeof author === 'undefined') {
        res.json(resultMessage(1, '請登入後貼文'));
    }

    if (typeof title === 'undefined' || title.length === 0 ){
        res.json(resultMessage(1, '請輸入標題'));
    }
    else if (article_class === '0'){
        res.json(resultMessage(1, '請選擇發佈在哪一個看板'));
    }
    
    else if (typeof content === 'undefined' || content.length === 0 ){
        res.json(resultMessage(1, '請輸入內容'));
    }
    else{
        let articleAdd = await bll.articleAdd( title, article_class,author, content );
        res.json(articleAdd);
    }
    
});

router.get('/article/list', async function(req, res){

    let articleList = await bll.articleList();
    res.json(articleList);
});

router.get('/article/content', async function(req, res){

    let { id } = req.query;
    let articleContent = await bll.articleContent(id);
    res.json(articleContent); 
});


module.exports = router;