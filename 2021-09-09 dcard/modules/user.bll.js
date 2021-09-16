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

    let memberInfo = await dal.memberInfo( email );
    password = MD5(password);
    memberInfo = memberInfo[0];

    if ( password === memberInfo.Password ) {
        return resultMessage( 0, '登入成功'); 
    }
    else {
        return resultMessage( 1, '登入失敗');
    }
}
module.exports = {
    memberJoin,
    memberLogin
}