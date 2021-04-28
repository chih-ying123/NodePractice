const express = require("express");
const { resultMessage } = require('../common');
const bll = require('./user.bll.js');

const router = express.Router();				// 路由管理


// /user/list

router.get('/list', async (req, res) => {

    let { pageIndex, pageSize } = req.query;

    //請求參數的處理 => 轉型， 驗證參數是否有效
    let userList = await bll.getUserList(pageIndex, pageSize);
    res.json(userList);

});


// /user/add
router.get('/add', async (req, res) => {

    res.json(resultMessage(0, 'userAdd'));
});

router.get('/update', async (req, res) => {

    res.json(resultMessage(0, 'userUpdate'));

});

module.exports = router;