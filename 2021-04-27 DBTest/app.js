let { dbConnectionPool, executeSQL } = require('./common.mysql.pool');

(async function () {
        let sqlStr = `
                SELECT 
                        UserName
                        , UserAccount
                        , UserPassword
                        , Memo 
                FROM \`User\` ;
        `;
        let result = await executeSQL(sqlStr);
        console.log(result);
        dbConnectionPool.end();
})();