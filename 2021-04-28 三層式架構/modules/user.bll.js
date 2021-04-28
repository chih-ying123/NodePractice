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


module.exports = {
    getUserList

}