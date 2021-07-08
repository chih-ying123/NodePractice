import { createConnection, Connection } from "typeorm";
import { v1 as uuidv1 } from 'uuid';

import { IDBSetting } from "./model/IDBSetting";
import { Log } from "./Log";

export class Dial {

    public static GetSQLConn(setting: IDBSetting, ...entities: any[]): Promise<Connection> {

        //@see https://github.com/typeorm/typeorm/blob/master/docs/connection.md
        
        return createConnection({
            name:uuidv1(), // @see BaseConnectionOptions:name
            type: "mariadb",
            host: setting.IP,
            port: parseInt(setting.PORT, 10),
            username: setting.USER,
            password: setting.PASSWORD,
            database: setting.DB,
            charset: setting.CharacterSet,
            entities: entities,
            synchronize: false // 關閉 自動創建
        }).catch(err=>{
            Log.WriteToFile("system",err) ;
            return null ;
        });

    }

}