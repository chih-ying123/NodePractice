const { dbConnection, executeSQL } = require('../common.mysql.pool');


async function getUserList(pageIndex, pageSize) {

    let totalRows = 0; // 資料總筆數
    let ids = await executeSQL(`SELECT Id FROM \`User\` ORDER BY Id ASC ;`);
    totalRows = ids.length;  // 取得資料總筆數   
    ids = ids.map(item => { return item.Id });
    //console.log(ids);

    let startIndex = (pageIndex - 1) * pageSize;  // 陣列是 0 Base
    let endIndex = pageIndex * pageSize;

    if (startIndex < 0) {
        startIndex = 0;
    }

    if (endIndex > ids.length) {
        endIndex = ids.length
    }

    let targets = ids.slice(startIndex, endIndex);
    //console.log(targets);

    let result = await executeSQL(`
        SELECT 
            Id
            , UserName
            , UserAccount
            , Email
            , Memo
            , CreateDate 
        FROM \`User\` 
        Where Id IN (${targets}) 
        ORDER BY Id ASC ;`
    );

    return {
        datas: result
        , totalRows
    }
}

async function ifUserAccountExists(UserAccount) {

    let selectUserAccount = await executeSQL(`
        SELECT UserAccount
        FROM \`User\` 
        Where UserAccount = N'${UserAccount}';`
    );

    //console.log(selectUserAccount)

    return selectUserAccount;  // 這是一個陣列

}

async function getUserdata(id) {

    let selectId = await executeSQL(`
        SELECT *
        FROM \`User\` 
        Where Id = ${id};`
    );

    return selectId;

}


async function addUser(UserName, UserAccount, UserPassword, Email, Memo) {

    let r = await executeSQL(`
    INSERT INTO \`user\`
    SET
        UserName = N'${UserName}'
        , UserAccount = N'${UserAccount}'
        , UserPassword = MD5('${UserPassword}')
        , Email = '${Email}'
        , Memo = N'${Memo}'
        , CreateDate = CURRENT_TIMESTAMP ;`
    );
    return r;

}

async function updateUser(Id, UserName, UserAccount, UserPassword, Email, Memo) {

    let r = await executeSQL(`
        UPDATE  \`User\`
        SET UserName = N'${UserName}'
            , UserAccount = N'${UserAccount}'
            , UserPassword = MD5('${UserPassword}')
            , Email = '${Email}'
            , Memo = N'${Memo}'
        WHERE Id = ${Id}
        ;`
    );

    return r;

}


/*
ifUserAccountExists('1313').then(() => {
    dbConnection.end();
}).catch(() => {
    dbConnection.end();
});
*/

module.exports = {
    getUserList
    , addUser
    , updateUser
    , ifUserAccountExists
    , getUserdata

}