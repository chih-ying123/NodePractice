const express = require("express");
const { resultMessage } = require('../common');
const bll = require('./user.bll.js');

const router = express.Router();				// 路由管理


// /user/list

router.get('/list', async (req, res) => {

    let pageIndex = parseInt(req.query.pageIndex, 10); 
    let pageSize = parseInt(req.query.pageSize, 10);

    if (isNaN(pageIndex)){
        console.log('pageIndex輸入錯誤');
        return res.json(resultMessage(1,'pageIndex請輸入數字',''))
    }
    if (isNaN(pageSize)){ 
        console.log('pageSize輸入錯誤');
        return res.json(resultMessage(1,'pageSize請輸入數字',''))
    }

    let userList = await bll.getUserList(pageIndex, pageSize);
    res.json(userList);

});


// /user/add
router.post('/add', async (req, res) => {

    res.json(resultMessage(0, 'userAdd'));
});

router.get('/update', async (req, res) => {

    res.json(resultMessage(0, 'userUpdate'));

});

module.exports = router;