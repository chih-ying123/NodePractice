// To parse this data:
//
//   import { Convert; IResTheirData } from ./file;
//
//   const iResTheirData = Convert.toIResTheirData(json);

export interface IResTheirData {
    id:      string;
    result:  Result;
    error: null | errormessage;
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
export interface errormessage {
    message: string;
    reason: string;
}
export interface Item {
    sn: string;
    userId: number;
    loginId: string;
    issueId: string;
    betId: string;
    gameBalance: number;
    fireCount: number;
    betAmount: number;
    validAmount: number;
    calcAmount: number;
    payout: number;
    orderTime: string;
    orderTimeBj: string;
    orderFrom: number;
    jackpot: string;
    extend: string;
    jackpotType: number;
    gameType: number;
   
}

export interface Stats {
    sumStat: sumStatResult[]
    subStat: subStatResult[]
}
export interface sumStatResult {
    orderCount: number;
    userCount: number;
    betAmount: number;
    payOutAmount: number;
    validAmount: number;
    jackpot: string;
    extend: number;
}
export interface subStatResult {
    orderCount: number;
    userCount: number;
    betAmount: number;
    payOutAmount: number;
    validAmount: number;
    jackpot: string;
    extend: number;
}