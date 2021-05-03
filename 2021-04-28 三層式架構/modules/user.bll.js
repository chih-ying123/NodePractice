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

async function addUser(UserName, UserAccount, UserPassword, Email, Memo) {

    let addresult = await dal.addUser(UserName, UserAccount, UserPassword, Email, Memo);

    if (addresult.resultCode === 0){
        return resultMessage(0, addresult.resultMessage, '');
    }
    else{
        return resultMessage(1, addresult.resultMessage, '' );
    }
}

module.exports = {
    getUserList
    , addUser

}