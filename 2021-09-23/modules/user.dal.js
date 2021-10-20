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
        SELECT * FROM article_class
    `)
    return result;
    
}

async function checkArticleClass( classId ) { 
    let result = await executeSQL(`
        SELECT Id 
        FROM article_class 
        WHERE Id = N'${ classId }'
    `)
    return result;
}

async function articleAdd( title, classId, authorId, content ){

    let result = await executeSQL(`
        INSERT INTO article
        SET
            ParentsId = 0
            , title = N'${title.replace(/\'/g,"\\\'")}'
            , classId = ${classId}
            , AuthorId =${authorId}
            , content = N'${content.replace(/\'/g,"\\\'")}'
            , CreateTime = CURRENT_TIMESTAMP ;
    `)
    return result;
}

async function articleList(){

    let result = await executeSQL(`
        SELECT  article.Id, article.Title, article.CreateTime,
                member.Username, article_class.Class
        FROM article

        INNER JOIN member
        ON article.AuthorId = member.Id 

        INNER JOIN article_class
        ON article.ClassId = article_class.Id
        WHERE article.ParentsId = 0
        ORDER BY article.Id DESC
    `)

    return result;
};

async function articleExist(id) {
    let result = await executeSQL(`
        SELECT Id FROM article WHERE id=N'${id}'
    `)
    return result;
}

async function articleContent(id){

    let result = await executeSQL(`
        SELECT  article.Title, article.Content, article.CreateTime,
                member.Username, article_class.Class
        FROM article
        INNER JOIN member
        ON article.AuthorId = member.Id
        
        INNER JOIN article_class
        ON article.ClassId = article_class.Id
        WHERE article.Id=${id}
    `)

    return result;

};

async function articleMessage(parentsId){

    let result = await executeSQL(`
        SELECT  article.ParentsId, article.Content, article.CreateTime,
                member.Username
        FROM article
        INNER JOIN member
        ON article.AuthorId = member.Id 
        WHERE article.ParentsId = ${parentsId}
        ORDER BY article.Id ASC
    `)

    return result;

};

async function parentsInfo(articleId){
    let result = await executeSQL(`
        SELECT Title, ClassId FROM article WHERE Id = ${articleId}
    `);
    return result;
}

async function messageAdd(articleId, Title, ClassId, authorId, content){

    let result = await executeSQL(`
        INSERT INTO article 
        SET 
            ParentsId =  ${articleId}
            , Title = N'${Title}'
            , ClassId = ${ClassId}
            , AuthorId = ${authorId}
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
    messageAdd,
    articleExist,
    parentsInfo
}