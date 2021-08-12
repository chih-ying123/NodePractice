export interface IEnv {
    baseURI: string;
    historyAPI: string;
    casinoId: string;
    gameHistoryApiToken: string;
}

// I = interface
export interface IAPIResponse{
    uuid: string;
    timestamp: string;
    data: IData[];
}

export interface IData{
    date: string;
    games: IGame[];
}

export interface IGame{
    id: string;
    startedAt: string;
    settledAt: string;
    status: string;
    gameType: string;
    participants: IParticipant[];
    result: string;
}

export interface IParticipant{
    playerId: string;
    bets:IBet[];                 
}

export interface IBet{
    stake: number;
    payout: number;
    transactionId: number;
}


// 對應資料表 BetData_EVO 欄位
export class IEVOBetDataForDB{
    id: string;
    startedAt: string;
    settledAt: string;
    status: string;
    gameType: string;
    playerId: string;
    stake: number;
    payout: number;
    winlose: number;
    transactionId: number;
    result: string;
}