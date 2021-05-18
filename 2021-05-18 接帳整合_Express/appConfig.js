const envValue = { //環境變數，區分不同設定檔用的
    Prod: "production"
    , Dev: "development"
}

module.exports = {
    envValue: envValue,
    env: envValue.Dev
}

/*

module.exports = {
    envValue: envValue,
    env: "development"
}


*/