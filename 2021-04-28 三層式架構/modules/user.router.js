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

    let Id = parseInt(req.body.Id, 10);
    let { UserName, UserAccount, UserPassword, Email, Memo } = req.body;
    let updateresult = await bll.updateUser(Id, UserName, UserAccount, UserPassword, Email, Memo);

    res.json(updateresult)

});

router.get('/getById', async (req, res) => {

    let Id = parseInt(req.query.Id, 10);
    if (isNaN(Id)) {
        //console.log('Id輸入錯誤');
        return res.json(resultMessage(1, 'Id請輸入數字'))
    }
    let Userdata = await bll.getUserdata(Id);
    res.json(Userdata);

});

module.exports = router;