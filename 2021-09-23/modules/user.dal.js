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

async function checkEmailPW( email, password ){

    let result = await executeSQL(`
        SELECT EMail, Password 
        FROM member 
        WHERE EMail = N'${email}'
        AND Password = MD5('${password}')
    `)

    return result;
}

async function articleClass() {
    let result = await executeSQL(`
        SELECT Class FROM article_class
    `)
    return result;
}

async function articleAdd( title, article_class, author, content ){

    let result = await executeSQL(`
        INSERT INTO article
        SET
            title = N'${title}'
            , class = N'${article_class}'
            , author = N'${author}'
            , content = N'${content}'
            , CreateTime = CURRENT_TIMESTAMP ;
    `)

    return result;
}

async function articleList(  ){

    let result = await executeSQL(`
        SELECT Id, Title, Class, Author, CreateTime 
        FROM article
        ORDER BY Id DESC
    `)

    return result;
}

module.exports = {
    memberExist,
    memberJoin,
    checkEmailPW,
    articleClass,
    articleAdd,
    articleList
}