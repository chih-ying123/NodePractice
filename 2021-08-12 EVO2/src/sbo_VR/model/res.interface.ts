export class Response {
    result: IPlayerBetList[];
    turnover: number;
    error: IResError;
    serverId: string;
}

export class IPlayerBetList {
    orderTime: string;
    modifyDate: string;
    refNo: string;
    username: string;
    gameId: number;
    odds: number;
    oddsStyle: string;
    stake: number;
    actualStake: number;
    turnover: string;
    winLost: string;
    status: string;
    productType: string;
    winLostDate: string;
    settleTime: string;
    subBet: IResSubBet[];
}

export interface IResSubBet {
    htScore: string;
    ftScore: string;
    betOption: string;
    marketType: string;
    hdp: number;
    odds: number;
    league: string;
    match: string;
    status: string;
    winlostDate: string; //DateTime(UTC-4)
    settleTime: string;
    liveScore: string;
    customeizedBetType: string;
}

export interface IResError {
    id: number;
    msg: string;
}