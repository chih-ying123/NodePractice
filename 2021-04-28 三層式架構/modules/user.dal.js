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

async function addUser(UserName, UserAccount, UserPassword, Email, Memo) {

    // 先檢查帳號是否已經存在

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
    if (r.affectedRows === 1) {
        //寫成功
    }
    else {
        //失敗
    }
    console.log(r);

}

async function updateUser(Id, UserName, UserAccount, UserPassword, Email, Memo) {
    await executeSQL(`
        UPDATE  \`User\`
        SET (UserName = ${UserName}
            , UserAccount = ${UserAccount}
            , UserPassword = ${UserPassword}
            , Email = ${Email}
            , Memo = ${Memo})
        WHERE Id = ${Id}
        ;`
    );

}


/*
addUser('jess', 'jessJess5001', '123456', '123@123.com', 'Memo').then(() => {
    dbConnection.end();
}).catch(() => {
    dbConnection.end();
});
*/

module.exports = {
    getUserList
    , addUser
    , updateUser

}