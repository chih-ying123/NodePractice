export interface IEnv {
    baseURI: string;
    getBetAPI: string;
    AgentCode: string;
    AgentKey: string;
    Currency: string;
}

export interface IAPIResponse{
    Result: number;
    Records: IRecords[];
}

export interface IRecords{
    bet: number;
    prize: number;
    winlose: number;
    before: number;
    after: number;
    jptax: number;
    jppoints: number;
    recordID: number;
    account: string;
    gameID: number;
    gametype: number;
    jpmode: number;
    bdate: string;
}

