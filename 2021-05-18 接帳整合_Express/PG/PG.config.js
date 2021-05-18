let appConfig = require('../appConfig');
let config = {};


// config["development"]
config[appConfig.envValue.Dev] = {}

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
