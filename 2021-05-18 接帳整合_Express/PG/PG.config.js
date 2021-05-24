let appConfig = require('../appConfig');
let config = {};


// config["development"]
config[appConfig.envValue.Dev] = {
    
    "operator_token" : "03eae309df05860da4dc655c7586d2c9",
    "secret_key" : "e299c1343a4109d4813afa64f074ee3e",
    "apiDomain" : "https://api.pg-bo.me/external-datagrabber",
    "api" : "Bet/v4/GetHistoryForSpecificTimeRange",
    "timeFormat" : "YYYY-MM-DD HH:mm:ss.SSS"

}

//config["production"]
config[appConfig.envValue.Prod] = {}


// envValue.Dev = 'development'
module.exports = config[appConfig.env];


/*
module.exports = {
    envValue: envValue,
    env: "development"
}

*/
