export class Response {
    result: IPlayerBetList[];
    turnover: number;
    error: IResError;
    serverId: string;
}

export class IPlayerBetList {
    refNo: string;
    username: string;
    sportsType: string;
    orderTime: string;
    winLostDate: string;
    settleTime: string;
    modifyDate: string;
    odds: number;
    oddsStyle: string;
    stake: number;
    actualStake: number;
    currency: number;
    status: string;
    winLost: string;
    turnover: string;
    isHalfWonLose: string;
    isLive: string;
    maxWinWithoutActualStake: number;
    ip: string;
    isSystemTagRisky: boolean;
    isCustomerTagRisky: boolean;
    subBet: IResSubBet[];
}

export interface IResSubBet {
    // transId: number,
    betOption: string,
    marketType: string,
    hdp: number,
    odds: number,
    league: string,
    match: string,
    status: string,
    winlostDate: string, //DateTime(UTC-4)
    liveScore: string,
    htScore: string,
    ftScore: string,
    customeizedBetType: string,
    isHalfWonLose: boolean,
    // isLive: boolean
    kickOffTime: string //DateTime(UTC-4)
}

export interface IResError {
    id: number;
    msg: string;
}