// To parse this data:
//
//   import { Convert, IResTheirData } from "./file";
//
//   const iResTheirData = Convert.toIResTheirData(json);

export interface IResTheirData {
    id:      string;
    result:  Result;
    error:   null;
    jsonrpc: string;
}

export interface Result {
    total:     number;
    stats:     Stats;
    pageIndex: number;
    pageSize:  number;
    etag:      null;
    page:      number;
    items:     Item[];
}

export interface Item {
    tranId:         null;
    aAmount:        number;
    loginId:        string;
    orderId:        number;
    moduleName:     string;
    orderStatus:    number;
    playId:         string;
    uid:            number;
    orderTime:      string;
    gameName:       string;
    payment:        number;
    sn:             string;
    bAmount:        number;
    moduleId:       number;
    gameId:         number;
    playNameEn:     string;
    issueId:        string;
    playName:       string;
    userId:         number;
    validAmount:    number;
    gameNameEn:     string;
    fromIp:         string;
    tableId:        string;
    orderFrom:      number;
    betContent:     null|string;
    noComm:         null|string;
    validBet:       number;
    lastUpdateTime: string;
}

export interface Stats {
    validAmountTotal:  number;
    aAmountTotal:      number;
    userCount:         number;
    paymentTotal:      number;
    bAmountTotal_:     number;
    bAmountTotal:      number;
    validBetTotal:     number;
    paymentTotal_:     number;
    validAmountTotal2: number;
}