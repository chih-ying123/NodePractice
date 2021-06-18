export interface IEnv {
    baseURI: string;
    historyAPI: string;
    casinoId: string;
    gameHistoryApiToken: string;
}

export interface APIResponse{
    uuid: string;
    data: data[];
}

export interface data{
    date: string;
    games: games[];
}

export interface games{
    id: string;
    startedAt: string;
    settledAt: string;
    status: string;
    gameType: string;
    participants: participants[];
}

export interface participants{
    playerId: string;
}