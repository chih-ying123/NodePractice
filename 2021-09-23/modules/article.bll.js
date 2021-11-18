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
        await getNodePath(articleAdd.insertId);
        return resultMessage( 0, '已發佈'); 
    }
    else {
        return resultMessage( 1, '文章發佈失敗');
    }
}

async function articleList(ClassId, AuthorId){

    let articleList = await dal.articleList(ClassId, AuthorId);
    let articleClassList = await dal.articleClass();
    let userRankingList = await dal.userRanking();
    let articleRankingList = await dal.articleRanking();   
    let result = { articleList, userRankingList, articleRankingList, articleClassList };
    return result;
};

async function articleContent(id){
    let articleExist = await dal.articleExist(id);
    let articleContent = await dal.articleContent(id);

    if ( articleExist.length === 0 || articleContent.length === 0){
        return resultMessage( 1, '文章不存在或出現錯誤' );
    }
    await dal.updateClickCount(id);
    return articleContent
}

async function messageAdd(articleId, authorId, content){

    let parentsInfo = await dal.parentsInfo(articleId);
    let { Title, ClassId } = parentsInfo[0];
    let messageAdd = await dal.messageAdd(articleId, Title, ClassId, authorId, content);
    if ( messageAdd.affectedRows === 1) { 
        await getNodePath(messageAdd.insertId);
        return resultMessage( 0, '已發佈'); 
     }
     else {
        return resultMessage( 1, '留言失敗');
     }
}

async function getNodePath(id){
    let nodePath = []; 
    nodePath.push(id);

    let result = await dal.getParentIdById(id);
    
    if (result.length === 0) {
        return nodePath;
    }

    let ParentsId = result[0].ParentsId;

    while (ParentsId !== 0) {

        nodePath.unshift(ParentsId) //Arr.unshift()加在字串最前面
        result = await dal.getParentIdById(ParentsId);
        ParentsId = result[0].ParentsId;
    }

    await dal.updateNodePath(id, nodePath.join(','));
};


module.exports = {
    articleClass,
    articleAdd,
    articleList,
    articleContent,
    messageAdd
}