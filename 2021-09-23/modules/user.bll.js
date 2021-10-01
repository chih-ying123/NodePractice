const dal = require('./user.dal');
const { resultMessage, MD5 } = require('../common');

async function memberJoin( email, password ){

    //帳號是否存在
    let memberExist = await dal.memberExist(email)
    if ( memberExist.length > 0 ){
        return resultMessage(1, '此email已被註冊')
    }

    let joinMessage = await dal.memberJoin( email, password );
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
    let memberExist = await dal.memberExist(email)
    if ( memberExist.length === 0 ){
        return resultMessage( 1, 'email輸入錯誤或未註冊' );
    }

    let memberCheck = await dal.checkEmailPW( email, password );
    if ( memberCheck.length === 1 ) {
        return resultMessage( 0, '登入成功'); 
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


module.exports = {
    memberJoin,
    memberLogin,
    articleClass,
    articleAdd,
    articleList
}