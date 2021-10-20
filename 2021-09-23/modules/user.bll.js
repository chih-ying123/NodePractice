const dal = require('./user.dal');
const { resultMessage, MD5 } = require('../common');

async function memberJoin( email, username, password ){

    let emailExist = await dal.emailExist(email);
    if ( emailExist.length > 0 ){
        return resultMessage(1, '此email已被註冊')
    }
    let usernameExist = await dal.usernameExist(username);
    if ( usernameExist.length > 0 ){
        return resultMessage(1, '暱稱已被使用')
    }

    let joinMessage = await dal.memberJoin( email, username, password );
    if ( joinMessage.affectedRows === 1) { 
        //mysql中的affected_rows
        //參考: https://blog.csdn.net/koastal/article/details/74783278

       return resultMessage( 0, '註冊成功'); 
    }
    else {
        return resultMessage( 1, '註冊失敗');
    }

}

async function memberLogin( email, password ){

    //帳號是否存在
    let emailExist = await dal.emailExist(email)
    if ( emailExist.length === 0 ){
        return resultMessage( 1, 'email輸入錯誤或未註冊' );
    }

    let memberCheck = await dal.checkEmailPW( email, password );

    if ( memberCheck.length === 1 ) {
        return resultMessage( 0, '登入成功', memberCheck[0] ); 
    }
    else {
        return resultMessage( 1, '登入失敗');
    }
}

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

async function articleList(){
    let articleList = await dal.articleList();
    return articleList
};

async function articleContent(id){
    let articleExist = await dal.articleExist(id);
    if ( articleExist.length === 0 ){
        return resultMessage( 1, '文章不存在或出現錯誤' );
    }
    let articleContent = await dal.articleContent(id);
    return articleContent
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
    memberJoin,
    memberLogin,
    articleClass,
    articleAdd,
    articleList,
    articleContent,
    articleMessage,
    messageAdd
}