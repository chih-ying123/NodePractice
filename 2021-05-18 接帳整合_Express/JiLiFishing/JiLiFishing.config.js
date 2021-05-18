let appConfig = require('../appConfig');
let config = {};

config[appConfig.envValue.Dev] = {//開發環境
    "API_URI": "https://wb-api.jlfafafa2.com/api1/",
    "API_SECRET_KEY": "3498e51d098fefd81ff696f8a0a42271be0a8259",
    "API_AgentId": "Winner_Single_VI"
}

config[appConfig.envValue.Prod] = { // 正式環境    
}


module.exports = config[appConfig.env];

