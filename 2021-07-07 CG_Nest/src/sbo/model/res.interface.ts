export class Response {
    PlayerBetList: IPlayerBetList[];
    turnover: number;
    error: IResError;
    serverId: string;
}

export class IPlayerBetList {
    refNo: string;
    username: string;
    sportType: string;
    orderTime: string;
    winlostDate: string;
    modifyDate: string;
    odds: number;
    oddsStyle: string;
    stake: number;
    actualStake: number;
    currency: number;
    status: string;
    winlose: string;
    turnover: string;
    isHalfWonLose: string;
    isLive: string;
    MaxWinWithoutActualStake: number;
    Ip: string
    subBet: IResSubBet[];
}

export interface IResSubBet {
    transId: number,
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
    isLive: boolean
    kickOffTime: string //DateTime(UTC-4)
}

export interface IResError {
    id: number;
    msg: string;
}