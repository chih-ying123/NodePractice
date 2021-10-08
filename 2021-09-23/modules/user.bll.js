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
    let username = memberCheck[0].Username;
    if ( memberCheck.length === 1 ) {
        return resultMessage( 0, '登入成功',username ); 
    }
    else {
        return resultMessage( 1, '登入失敗');
    }
}

async function articleClass(){

    let articleClass = await dal.articleClass();
    let articleClassList = [];

    for(let i=0; i<articleClass.length; i++){
        articleClassList.push(articleClass[i].Class)
    }
    
    return articleClassList;

}

async function articleAdd( title, article_class,author, content ){

    let checkArticleClass = await dal.checkArticleClass( article_class );
    if ( checkArticleClass.length === 0 ){
        return resultMessage(1, '請選擇正確看板')
    }

    let articleAdd = await dal.articleAdd( title, article_class,author, content );
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
    let articleContent = await dal.articleContent(id);
    return articleContent
}

async function articleMessage(articleId){
    let articleContent = await dal.articleMessage(articleId);
    return articleContent
}

async function messageAdd(articleId, username, content){
    
    let messageAdd = await dal.messageAdd(articleId, username, content);
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