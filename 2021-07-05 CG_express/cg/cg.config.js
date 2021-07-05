let appConfig = require('../appConfig');
let config = {};

config[appConfig.envValue.Dev] = {//開發環境
    "apiURI": "http://testenv-dev.cg11systems.com/client/api/getGameRecord.php",
    "channelId": "77668",
    "key":"Pf9t8OaUDC4sjWxFZ3HKfnE3wSAIValVqtwOqLdtCw4=",
    "iv": "MJ2MTl6sSHYLLmdu4T5Hxg=="
}

config[appConfig.envValue.Prod] = { // 正式環境    
}


module.exports = config[appConfig.env];