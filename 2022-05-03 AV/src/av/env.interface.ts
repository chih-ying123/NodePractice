export interface IEnv {
    baseURI: string;
    getBetAPI: string;
    secretkey: string;
    md5key: string;
    encryptkey: string;
}


export interface IbetDetails{
    playerID: number;
    extPlayerID: string;
    gameID:  string;
    playSessionID: number;
    parentSessionID: number;
    startDate: string;
    endDate: string;
    status: string ;
    type: string;
    bet: number;
    win:number;
    currency: string;
    jackpot: number;
    roundDetails: string;
}

