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

async function checkArticleClass( article_class ) { 
    let result = await executeSQL(`
        SELECT Class 
        FROM article_class 
        WHERE class = N'${ article_class }'
    `)
    return result;
}

async function articleAdd( title, article_class, author, content ){

    let result = await executeSQL(`
        INSERT INTO article
        SET
            title = N'${title.replace(/\'/g,"\\\'")}'
            , class = N'${article_class}'
            , author = N'${author.replace(/\'/g,"\\\'")}'
            , content = N'${content.replace(/\'/g,"\\\'")}'
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

async function articleMessage(articleId){

    let result = await executeSQL(`
        SELECT * 
        FROM article_message
        WHERE articleId=${articleId}
    `)

    return result;

};


async function messageAdd(articleId, username, content){
    console.log(articleId, username, content);

    let result = await executeSQL(`
        INSERT INTO article_message 
        SET 
            ArticleId =  ${articleId}
            , Username = N'${username.replace(/\'/g,"\\\'")}'
            , Content = N'${content.replace(/\'/g,"\\\'")}'
            , CreateTime = CURRENT_TIMESTAMP;
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
    articleContent,
    articleMessage,
    messageAdd
}