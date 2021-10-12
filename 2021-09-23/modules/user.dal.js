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

async function articleAdd( title, article_class, authorId, content ){

    let result = await executeSQL(`
        INSERT INTO article
        SET
            title = N'${title.replace(/\'/g,"\\\'")}'
            , class = N'${article_class}'
            , AuthorId =${authorId}
            , content = N'${content.replace(/\'/g,"\\\'")}'
            , CreateTime = CURRENT_TIMESTAMP ;
    `)
    return result;
}

async function articleList(){

    let result = await executeSQL(`
        SELECT  article.Id, article.Title, article.Class, article.CreateTime,
                member.Username Author
        FROM article
        LEFT OUTER JOIN member
        ON article.AuthorId = member.Id
        ORDER BY article.Id DESC
    `)

    return result;
};

async function articleContent(id){

    let result = await executeSQL(`
        SELECT  article.Title, article.Class, article.Content, article.CreateTime,
                member.Username Author
        FROM article
        LEFT JOIN member
        ON article.AuthorId = member.Id
        WHERE article.Id=${id}
    `)

    return result;

};

async function articleMessage(articleId){

    let result = await executeSQL(`
        SELECT  article_message.Content, article_message.CreateTime,
                member.Username
        FROM article_message
        LEFT JOIN member
        ON article_message.AuthorId = member.Id
        WHERE article_message.articleId=${articleId}
    `)

    return result;

};


async function messageAdd(articleId, username, content){

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