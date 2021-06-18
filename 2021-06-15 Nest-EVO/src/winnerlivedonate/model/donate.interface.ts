import { Settings } from "http2"

export interface APIResponse {
    error_code: string;
    data: Array<IDonate>
}

export interface IDonate{
    buyid:string,
    dept_id:string,
    username:string,
    nickname:string,
    gamename:string,
    playkey:string,
    tablenum:string,
    money:string,
    time:string,
    dealerid:string,
    dealername:string,
    list_id:string,
    giftname:string
}