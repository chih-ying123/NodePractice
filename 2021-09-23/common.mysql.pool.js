const endOfLine = require('os').EOL;
const mysql = require('mysql');
const common = require('./common');

const options = {
    "host": "192.168.202.1",
    "user": "root",
    "password": "ixwn4uwc",
    "database": "dcard",
    "timezone": 8,
    "connectionLimit": 50,
    "multipleStatements": false
};
const pool = mysql.createPool(options);

function executeSQL(sql) {

    return new Promise((resolve, reject) => {

        pool.getConnection(function (err, connection) {
            if (err) {
                common.log('getConnectionErr.txt', err);
                return reject(err);
            }

            connection.query(sql, function (err, results, fields) {

                try {

                    if (err) {
                        common.log("dbError.txt", `${err}${endOfLine}${endOfLine}`);
                        common.log("dbErrorSQL.sql", `${sql}${endOfLine}${endOfLine}`);
                        reject(err);
                    }
                    else if (results !== undefined && results != null) {
                        let resultJSON = JSON.stringify(results);
                        let r = JSON.parse(resultJSON);
                        resolve(r);
                    }
                    else {
                        resolve([]);
                    }
                } catch (err) {
                    common.log("dbError.txt", `${err}${endOfLine}${endOfLine}`);
                    common.log("dbErrorSQL.sql", `${sql}${endOfLine}${endOfLine}`);
                    reject(err);
                }
                finally {
                    connection.release();
                }
            });

        });
    }).catch((err) => {
        common.log("dbError.txt", `${err}${endOfLine}${endOfLine}`);
        common.log("dbErrorSQL.sql", `${sql}${endOfLine}${endOfLine}`);       
    });
}

module.exports = {
    dbConnection: pool
    , executeSQL
}