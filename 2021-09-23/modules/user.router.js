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

router.get('/article/class', async function(req, res) {

    let articleClass = await bll.articleClass();
    res.json(articleClass)
});

router.post('/article/add', async function(req, res){

    let { title, classId, content} = req.body;
    let authorId = req.session.userId;

    if (typeof authorId === 'undefined') {
        res.json(resultMessage(1, '請登入後貼文'));
    }
    else if (typeof title === 'undefined' || title.length === 0 ){
        res.json(resultMessage(1, '請輸入標題'));
    }
    else if (classId === '0'){
        res.json(resultMessage(1, '請選擇發佈在哪一個看板'));
    }
    
    else if (typeof content === 'undefined' || content.length === 0 ){
        res.json(resultMessage(1, '請輸入內容'));
    }
    else{

        let articleAdd = await bll.articleAdd( title, classId, authorId, content );
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

router.get('/article/message', async function(req, res){

    let parentsId = req.query.id;
    let articleMessage = await bll.articleMessage(parentsId);
    res.json(articleMessage); 
});

router.post('/article/messageAdd', async function(req, res){

    let { articleId, content } = req.body;
    let authorId = req.session.userId;

    if (typeof authorId === 'undefined') {
        res.json(resultMessage(1, '請先登入'));
    }
    else if (typeof content === 'undefined' || content.length === 0 ){
        res.json(resultMessage(1, '請輸入內容'));
    }
    else{
        let messageAdd = await bll.messageAdd(articleId, authorId, content);
        res.json(messageAdd);
    }
 
});

router.post('/message/kids', async function(req, res) {
    let { id } = req.body;
    let messageKids = await bll.articleMessage(id);
    res.json(messageKids);
});


module.exports = router;