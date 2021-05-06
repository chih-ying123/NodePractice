// 只處理參數相關
const express = require('express');
const { resultMessage } = require('../common');
const bll = require('./user.bll.js');
//const dal = require('./user.dal.js');    // router 不會引入 dal， router只跟bll溝通

const router = express.Router(); // 路由管理

//app.use -> 請求攔截 (濾網)
router.use((req, res, next) => {
	//console.log('攔截-----------------------------------------');
	//請求進來的參數會有兩個來源 req.query、 req.body
	//有傳值進來 要檢查值是否正確
	let Id = req.query.Id || req.body.Id; //記得!傳進來是字串
	let pageIndex = req.query.pageIndex || req.body.pageIndex;
	let pageSize = req.query.pageSize || req.body.pageSize;
	//console.log(Id); //沒傳東西是 undefined
	try {
		if (typeof Id === 'string' && Id.length > 0) {
			//要多判斷Id裡面有東西避免空字串
			let parseId = parseInt(Id);
			if (isNaN(parseId)) {
				throw Error('Id需為數字');
			}
		}
		if (typeof pageIndex === 'string' && pageIndex.length > 0) {
			let parsepageIndex = parseInt(pageIndex);
			if (isNaN(parsepageIndex)) {
				throw Error('pageIndex需為數字');
			}
		}
		if (typeof pageSize === 'string' && pageSize.length > 0) {
			let parsepageSize = parseInt(pageSize);
			if (isNaN(parsepageSize)) {
				throw Error('pageSize需為數字');
			}
		}
		next();
	} catch (err) {
		res.json(resultMessage(1, err.message));
	}
});

// /user/list

router.get('/list', async (req, res) => {
	let pageIndex = req.query.pageIndex || req.body.pageIndex;
	if (typeof pageIndex === 'undefined' || pageIndex.length == 0) {
		console.log('請輸入pageIndex');
		res.json(resultMessage(1, '請輸入pageIndex'));
	}
	let  pageSize = req.query. pageSize || req.body. pageSize;
	if (typeof  pageSize === 'undefined' ||  pageSize.length == 0) {
		console.log('請輸入 pageSize');
		res.json(resultMessage(1, '請輸入 pageSize'));
	}

	let userList = await bll.getUserList(pageIndex, pageSize);
	res.json(userList);
});

// /user/add
router.post('/add', async (req, res) => {
	let { UserName, UserAccount, UserPassword, Email, Memo } = req.body;

	if (UserName.length < 4) {
		console.log('UserName輸入錯誤');
		return res.json(resultMessage(1, '暱稱最少4個字'));
	}

	let addresult = await bll.addUser(
		UserName,
		UserAccount,
		UserPassword,
		Email,
		Memo
	);

	res.json(addresult);
});

router.post('/update', async (req, res) => {
	//我要Id 但是外面沒傳進來
	let Id = req.query.Id || req.body.Id;
	if (typeof Id === 'undefined' || Id.length == 0) {
		console.log('請輸入Id');
		res.json(resultMessage(1, '請輸入Id'));
	}

	let { UserName, UserAccount, UserPassword, Email, Memo } = req.body;
	let updateresult = await bll.updateUser(
		Id,
		UserName,
		UserAccount,
		UserPassword,
		Email,
		Memo
	);

	res.json(updateresult);
});

router.get('/getById', async (req, res) => {
	//我要Id 但是外面沒傳進來
	let Id = req.query.Id || req.body.Id;
	if (typeof Id === 'undefined' || Id.length == 0) {
		console.log('請輸入Id');
		res.json(resultMessage(1, '請輸入Id'));
	}

	let Userdata = await bll.getUserdata(Id);
	res.json(Userdata);
});

module.exports = router;
