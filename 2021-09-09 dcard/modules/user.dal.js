const { dbConnection, executeSQL } = require('../common.mysql.pool');

async function memberExist(email){
    
    let selectMember = await executeSQL(`
        SELECT EMail 
        FROM member 
        WHERE EMail = N'${email}'
    `);

    return selectMember;
}

async function memberJoin( email, password ){

    let result = await executeSQL(`
        INSERT INTO member
        SET
            EMail = N'${email}'
            , Password = MD5('${password}')
            , CreateTime = CURRENT_TIMESTAMP ;
    `)

    return result;
}

module.exports = {
    memberExist,
    memberJoin
}