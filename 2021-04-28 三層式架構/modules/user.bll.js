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

    let result = await dal.ifUserAccountExists(UserAccount);
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

async function getUserdata(Id){
    //Id是否存在
    let getUserdata = await dal.getUserdata(Id);
    if (getUserdata.length === 0) {
        //console.log('Id不存在');
        return resultMessage(1, 'Id不存在');
    }

    getUserdata = getUserdata[0];
    return resultMessage(0, '', {
        getUserdata
    });

}

async function updateUser(Id, UserName, UserAccount, UserPassword, Email, Memo){

    let updateresult = await dal.updateUser(Id, UserName, UserAccount, UserPassword, Email, Memo);
    if (updateresult.affectedRows === 1) {

        return resultMessage(0, '資料修改完成');
    }
    else {
        return resultMessage(1, '資料新增失敗');
    }
}

module.exports = {
    getUserList
    , addUser
    , getUserdata
    , updateUser

}