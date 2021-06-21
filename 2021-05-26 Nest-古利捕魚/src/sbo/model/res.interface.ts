export class ResTheirData {
    player_name: string;
    vendor_code: string;
    game_code: string;
    parent_bet_id: string;
    bet_id: string;
    trans_type: string;
    currency: string;
    wallet_code: string;
    bet_amount: number;
    turn_over: number;
    win_amount: number;
    created_at: string;
    traceId: string;
    orderTime: string;
    winlostDate: string;
    modifyDate: string;
    odds: number;
    subBet: IResSubBet[];
}

export interface IResAllBetData {
    data: IResBetData;
    error: IResErr;
}

export interface IResBetData {
    action_result: string;
    betlogs: IResBetLogs[];
    last_record_time: string;
}

export interface IResBetLogs {
    player_name: string;
    vendor_code: string;
    game_code: string;
    parent_bet_id: string;
    bet_id: string;
    trans_type: string;
    currency: string;
    wallet_code: string;
    bet_amount: number;
    win_amount: number;
    traceId: string;
    created_at: string;
    stake_at: string;
}

export interface IResAllDetailData {
    data: IResDetailData;
    error: IResErr;
}

export interface IResDetailData {
    action_result: string;
    betlogs: IResDetailBetLogs[];
    last_record_time: string;
}

export interface IResDetailBetLogs {
    subBet: IResSubBet[];
    bet_id: string;
    player_name: string;
    sportType: string;
    orderTime: string; //DateTime(UTC - 4)
    winlostDate: string; //DateTime(UTC - 4)
    modifyDate: string; //DateTime(UTC - 4)
    odds: number;
    oddsStyle: string;
    stake: number;
    actualStake: number;
    currency: string;
    status: string;
    winlose: number;
    turnover: number;
    isHalfWonLose: boolean;
    isLive: boolean;
    MaxWinWithoutActualStake: number;
    Ip: string;
    modify_at: string;
}

export interface IResSubBet {
    betOption: string;
    marketType: string;
    hdp: number;
    odds: number;
    league: string;
    match: string;
    status: string;
    winlostDate: string; //DateTime(UTC-4)
    liveScore: string;
    htScore: string;
    ftScore: string;
    customeizedBetType: string;
    isHalfWonLose: boolean;
    isLive: boolean
}

export interface IResErr {
    code: string;
    message: string;
}