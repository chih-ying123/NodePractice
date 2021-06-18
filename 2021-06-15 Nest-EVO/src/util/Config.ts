import { IDBSetting } from "./model/IDBSetting";

export class Config{
    public static get DB():IDBSetting{
        return process.env as any ;
    }
}