const { dbConnection, executeSQL } = require('../common.mysql.pool');

async function articleClass() {
    let result = await executeSQL(`
        SELECT    article_class.Id
                , article_class.Class
                , IFNULL(Total, 0)AS Total
        FROM article_class
        LEFT JOIN 
        (
            SELECT  classId, COUNT(*)AS Total
            FROM article
            WHERE ParentsId = 0
            GROUP BY classId 
        )AS article ON article_class.Id = article.classId
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
            , CreateTime = CURRENT_TIMESTAMP 
            , ClickTimes = 0;
    `)
    return result;
}

async function articleList(ClassId, AuthorId){

    let result = await executeSQL(`
        SELECT  article.Id, article.Title, article.CreateTime, article.ClickCount
                , member.Username, article_class.Class
        FROM article

        INNER JOIN member
        ON article.AuthorId = member.Id 

        INNER JOIN article_class
        ON article.ClassId = article_class.Id
        WHERE ParentsId = 0 
            AND (${ClassId}=0 OR ClassId=${ClassId}) 
            AND (${AuthorId}=0 OR AuthorId=${AuthorId})
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
        SELECT    article.Id, article.NodePath, article.Title, article.Content
                , article.CreateTime,article.ClickCount
                , member.Username, article_class.Class
        FROM article
        INNER JOIN member
        ON article.AuthorId = member.Id
        
        INNER JOIN article_class
        ON article.ClassId = article_class.Id
        WHERE article.ParentsId=0 and article.Id=${id}

        UNION ALL  -- 上/下 資料結果垂直合併
        SELECT    article.Id, article.NodePath, article.Title, article.Content
                , article.CreateTime,article.ClickCount
                , member.Username, article_class.Class
        FROM article
        INNER JOIN member
        ON article.AuthorId = member.Id
        
        INNER JOIN article_class
        ON article.ClassId = article_class.Id WHERE nodePath LIKE '${id},%' -- id的全部下級資料
    `)

    return result;

};

async function articleMessage(parentsId){

    let result = await executeSQL(`
        SELECT  article.Id, article.Content, article.CreateTime,
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
            , CreateTime = CURRENT_TIMESTAMP
            , ClickCount = 0 
            , NodePath = 0 ;
    `)
    return result;
};

async function userRanking(){
    let result = await executeSQL(`
        SELECT    member.Id
                , member.Username
                , IFNULL(total,0) AS Total
        FROM member LEFT JOIN(    
            SELECT    authorId
                    , COUNT(*)AS Total
            FROM article
            WHERE ParentsId = 0
            GROUP BY authorId
        )AS article ON article.AuthorId = member.Id
        ORDER BY Total DESC
        LIMIT 10
    `);
    return result;
}

async function updateClickCount(Id){
    let result = await executeSQL(`
        UPDATE article SET ClickCount = ClickCount+1 WHERE Id=${Id}
    `);
    return result;
}

async function articleRanking(){
    let result = await executeSQL(`
        SELECT Id, Title, ClickCount
        FROM article 
        WHERE ParentsId = 0
        ORDER BY ClickCount DESC
        LIMIT 10
    `);
    return result;
}

module.exports = {
    articleClass,
    checkArticleClass,
    articleAdd,
    articleList,
    articleContent,
    articleMessage,
    messageAdd,
    articleExist,
    parentsInfo,
    userRanking,
    updateClickCount,
    articleRanking
}