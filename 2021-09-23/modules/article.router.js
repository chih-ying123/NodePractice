const express = require('express');
const router = express.Router();
const bll = require('./article.bll');
const { resultMessage } = require('../common');


router.get('/class', async function(req, res) {

    let articleClass = await bll.articleClass();
    res.json(articleClass)
});

router.post('/add', async function(req, res){

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

router.get('/list', async function(req, res){
    
    let { ClassId } = req.query
    let articleList = await bll.articleList(ClassId);
    res.json(articleList);
});

router.get('/content', async function(req, res){

    let { id } = req.query;
    let articleContent = await bll.articleContent(id);
    res.json(articleContent); 
});

router.get('/message', async function(req, res){

    let parentsId = req.query.id;
    let articleMessage = await bll.articleMessage(parentsId);
    res.json(articleMessage); 
});

router.post('/messageAdd', async function(req, res){

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



module.exports = router;