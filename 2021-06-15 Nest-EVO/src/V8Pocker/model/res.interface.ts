
export interface IResTheirData {
    m: string;
    s: number;
    d: Result;
}

export interface Result {
    code: number;
    start: number;
    end: number;
    count: number;
    list: item;
}

export interface item {
    GameID: string;
    Accounts: string;
    ServerID: number;
    KindID: number;
    TableID: number;
    ChairID: number;
    UserCount: number;
    CellScore: number;
    AllBet: number;
    Profit: number;
    Revenue: string;
    GameStartTime: string;
    GameEndTime: string;
    CardValue: string;
    ChannelID: number;
    LineCode: string;
}