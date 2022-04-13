export interface IEnv {
    baseURI: string;
    getBetAPI: string;
    Authentication: string;
    UserAgent: string;
    XRequestID: string;
    currency: string;
}

export interface IAPIResponse{
    errorCode: number;
    errorMessage: string;
    totalPage: number;
    currentPage: number;
    data: IData[];
}

export interface IData{
    playerId: string;
    statementDate: string;
    betTime: string;
    refNo: string;
    betStatus: string;
    gameCode: string;
    gameName: string;
    currency: string;
    betAmount: number;
    effectiveStake: number;
    winLoss: number;
}

