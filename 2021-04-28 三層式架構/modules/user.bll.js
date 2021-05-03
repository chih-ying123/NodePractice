const { resultMessage, getPagination } = require('../common');
const dal = require('./user.dal')


async function getUserList(pageIndex, pageSize) {

    let result = await dal.getUserList(pageIndex, pageSize);
    let pageInfo = getPagination(result.totalRows, pageSize, pageIndex, 10);

    return resultMessage(0, '', {
        datas: result.datas
        , pageInfo
    });
}

async function ifUserAccountExists(UserAccount) {

    let result = await dal.ifUserNameExists(UserAccount);
    return result;

}

async function addUser(UserName, UserAccount, UserPassword, Email, Memo) {

    // 先判斷帳號是否存在
    let _ifUserAccountExistsResult = await ifUserAccountExists(UserAccount);
    if (_ifUserAccountExistsResult.length > 0) {
        return resultMessage(1, '帳號重複');
    }

    let addresult = await dal.addUser(UserName, UserAccount, UserPassword, Email, Memo);

    if (addresult.affectedRows === 1) {

        return resultMessage(0, '資料新增成功');
    }
    else {
        return resultMessage(1, '資料新增失敗');
    }
}

module.exports = {
    getUserList
    , addUser

}