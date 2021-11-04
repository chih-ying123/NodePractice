const { dbConnection, executeSQL } = require('../common.mysql.pool');

async function emailExist(email){
    
    let result = await executeSQL(`
        SELECT EMail 
        FROM member 
        WHERE EMail = N'${email}'
    `);
    return result;
}

async function usernameExist(username){
    
    let result = await executeSQL(`
        SELECT Username 
        FROM member 
        WHERE Username = N'${username}'
    `);
    return result;
}

async function memberJoin( email, username, password ){

    let result = await executeSQL(`
        INSERT INTO member
        SET
            EMail = N'${email}'
            , Username = N'${username.replace(/\'/g,"\\\'")}' 
            , Password = MD5('${password}')
            , CreateTime = CURRENT_TIMESTAMP ;
    `)

    return result;
}

async function checkEmailPW( email, password ){

    let result = await executeSQL(`
        SELECT Id, Username 
        FROM member 
        WHERE EMail = N'${email}'
        AND Password = MD5('${password}')
    `)

    return result;
}


module.exports = {
    emailExist,
    usernameExist,
    memberJoin,
    checkEmailPW,
}