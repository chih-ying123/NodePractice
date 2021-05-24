const express = require('express');
const router = express.Router();
const bll = require('./PG.bll');
const { resultMessage, dateSplitByMin, getYYYYMMDDhhmmss } = require('../common');


router.get('/', function (req, res) {
    res.redirect('/PG.html');
});

router.get('/getDateTimeList', function (req, res) {

    let date = req.query.date || getYYYYMMDDhhmmss(new Date()).substring(0, 10);
    let dateTimeList = dateSplitByMin(date, 60);
    res.json(dateTimeList.reverse());

});

router.get('/getBetData',async function (req, res) {

    let startTime = req.query.start;
    let endTime = req.query.end;

    let pageIndex = 1;
    let pageSize = 1500;
    let datas = await bll.getBetData(startTime, endTime);


    res.json(resultMessage(0, '', datas));


});

module.exports = router;