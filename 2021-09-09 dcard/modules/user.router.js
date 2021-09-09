const express = require('express');
const router = express.Router();

router.get('/', function(req, res) {
    res.redirect('/html/member_join.html')
});

router.post('/member/join', function(req, res) {

    let { email, password } = req.body;
    console.log(email, password);
    res.end('123')
});

module.exports = router;