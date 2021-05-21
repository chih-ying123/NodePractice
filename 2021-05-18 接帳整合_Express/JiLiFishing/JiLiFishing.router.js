const express = require('express');
const { resultMessage, dateSplitByMin, getYYYYMMDDhhmmss } = require('../common');
const bll = require('./JiLiFishing.bll');
const router = express.Router();

router.get('/', function (req, res) { 
    res.redirect('/JiLiFishing.html');
});

router.get('/getDateTimeList', function (req, res) {
    let date = req.query.date || getYYYYMMDDhhmmss(new Date()).substring(0, 10); //substring() 擷取兩個索引之間的字, 取日期 yyyy-mm-dd 所以是0-10
    let dateTimeList = dateSplitByMin(date, 60);
    res.json(dateTimeList.reverse());  // 反向排序送出去
});

router.get('/getBetData', async function (req, res) {

    let start = req.query.start;
    let end = req.query.end;

    let pageIndex = 1;
    let pageSize = 1000;
    let datas = await bll.getBetData(start, end, pageIndex, pageSize);
    res.json(resultMessage(0, '', datas));
});

module.exports = router;