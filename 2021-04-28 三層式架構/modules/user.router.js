// 只處理參數相關
const express = require("express");
const { resultMessage } = require('../common');
const bll = require('./user.bll.js');
//const dal = require('./user.dal.js');    // router 不會引入 dal， router只跟bll溝通

const router = express.Router();				// 路由管理


// /user/list

router.get('/list', async (req, res) => {

    let pageIndex = parseInt(req.query.pageIndex, 10);
    let pageSize = parseInt(req.query.pageSize, 10);

    if (isNaN(pageIndex)) {
        console.log('pageIndex輸入錯誤');
        return res.json(resultMessage(1, 'pageIndex請輸入數字' ))
    }
    if (isNaN(pageSize)) {
        console.log('pageSize輸入錯誤');
        return res.json(resultMessage(1, 'pageSize請輸入數字'))
    }

    let userList = await bll.getUserList(pageIndex, pageSize);
    res.json(userList);

});


// /user/add
router.post('/add', async (req, res) => {

    let { UserName, UserAccount, UserPassword, Email, Memo } = req.body;

    if (UserName.length < 4) {
        console.log('UserName輸入錯誤');
        return res.json(resultMessage(1, '暱稱最少4個字'))
    }

    let addresult = await bll.addUser(UserName, UserAccount, UserPassword, Email, Memo);
    
    res.json(addresult);
});

router.post('/update', async (req, res) => {

    res.json(resultMessage(0, 'userUpdate'));

});

router.post('/getById', async (req, res) => {

    let id = parseInt(req.query.id, 10);
    if (isNaN(id)) {
        console.log('id輸入錯誤');
        return res.json(resultMessage(1, 'id請輸入數字'))
    }
    console.log(id);
    res.json();

});

module.exports = router;