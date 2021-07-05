const express = require('express');
const router = express.Router();
const { resultMessage, dateSplitByMin, getYYYYMMDDhhmmss } = require('../common');
const bll = require('./cg.bll');

router.get('/', function (req, res) {
    res.redirect('/cg.html');
});

router.get('/getDateTimeList', function (req, res) {

    let date = req.query.date || getYYYYMMDDhhmmss(new Date()).substring(0, 10);//substring() 擷取兩個索引之間的字, 取日期 yyyy-mm-dd 所以是0-10
    let dateTimeList = dateSplitByMin(date, 60);
    res.json(dateTimeList.reverse()); // 反向排序送出去

});

router.get('/getBetData',async function (req, res) {

    let startTime = req.query.start;
    let endTime = req.query.end;

    let datas = await bll.getBetData(startTime, endTime);


    res.json(resultMessage(0, '', datas));


});

module.exports = router;