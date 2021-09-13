const express = require('express');
const router = express.Router();
const bll = require('./user.bll');

router.get('/', function(req, res) {
    res.redirect('/member_join.html')
});

router.post('/member/join', async function(req, res) {

    let { email, password } = req.body;
    let resultMessage = await bll.memberJoin( email, password );

    res.json(resultMessage)
});

module.exports = router;