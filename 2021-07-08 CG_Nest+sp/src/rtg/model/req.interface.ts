export interface IToken {
    token: string;
}

export interface IReqTheirData {
    params: Params;
}

export interface Params {
    agentId:  string;
    fromDate: string;
    toDate:   string;
}
