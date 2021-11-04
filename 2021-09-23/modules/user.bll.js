const dal = require('./user.dal');
const { resultMessage } = require('../common');

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



module.exports = {
    memberJoin,
    memberLogin,
   
}