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
            , Username = N'${username}'
            , Password = MD5('${password}')
            , CreateTime = CURRENT_TIMESTAMP ;
    `)

    return result;
}

async function checkEmailPW( email, password ){

    let result = await executeSQL(`
        SELECT Username 
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

async function checkArticleClass( article_class ) { //明天寫這邊
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

async function articleList(){

    let result = await executeSQL(`
        SELECT Id, Title, Class, Author, CreateTime 
        FROM article
        ORDER BY Id DESC
    `)

    return result;
};

async function articleContent(id){

    let result = await executeSQL(`
        SELECT * 
        FROM article
        WHERE Id=${id}
    `)

return result;

};


module.exports = {
    emailExist,
    usernameExist,
    memberJoin,
    checkEmailPW,
    articleClass,
    checkArticleClass,
    articleAdd,
    articleList,
    articleContent
}