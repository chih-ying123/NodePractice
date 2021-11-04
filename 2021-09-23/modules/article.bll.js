const dal = require('./article.dal');
const { resultMessage } = require('../common');

async function articleClass(){

    let articleClass = await dal.articleClass();
    return articleClass;

}

async function articleAdd( title, classId, authorId, content ){

    let checkArticleClass = await dal.checkArticleClass( classId );
    if ( checkArticleClass.length === 0 ){
        return resultMessage(1, '請選擇正確看板')
    }

    let articleAdd = await dal.articleAdd( title, classId, authorId, content );
    if ( articleAdd.affectedRows === 1) { 
       return resultMessage( 0, '已發佈'); 
    }
    else {
        return resultMessage( 1, '文章發佈失敗');
    }

}

async function articleList(ClassId){

    let articleList = await dal.articleList(ClassId);
    return articleList
};

async function articleContent(id){
    let articleExist = await dal.articleExist(id);
    let articleContent = await dal.articleContent(id);

    if ( articleExist.length === 0 || articleContent.length === 0){
        return resultMessage( 1, '文章不存在或出現錯誤' );
    }
    
    return articleContent;
}

async function articleMessage(parentsId){
    let articleContent = await dal.articleMessage(parentsId);
    return articleContent
}

async function messageAdd(articleId, authorId, content){

    let parentsInfo = await dal.parentsInfo(articleId);
    let { Title, ClassId } = parentsInfo[0];
    let messageAdd = await dal.messageAdd(articleId, Title, ClassId, authorId, content);
    if ( messageAdd.affectedRows === 1) { 
        return resultMessage( 0, '已發佈'); 
     }
     else {
        return resultMessage( 1, '留言失敗');
     }

}


module.exports = {
    articleClass,
    articleAdd,
    articleList,
    articleContent,
    articleMessage,
    messageAdd,
}