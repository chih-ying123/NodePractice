export interface IEnv {
    baseURI: string;
    getBetAPI: string;
    pid: number;
    key: string;
}

export interface IAPIResponse{
    status: Istatus;
    data: Idata;
}

export interface Istatus{
    code: number;
    message: string;
    timestamp: number;
}

export interface Idata{
    betlog_result: Ibetlog_result[];
}

export interface Ibetlog_result{
    bet_id: string;
    game_code: string;
    game_name: string;
    game_type: number;
    game_type_name: string;
    field: string;  
    account: string;
    bet_valid: number;
    bet_content : string;
    content : string;
    result : string;
    bet_amount : number;
    got_amount : number;
    win_amount : number;
    lose_amount : number;
    payoff : number;
    payoff_at : string;
    feedback : number;
    wash : number;
    pca_contribute : number;
    pca_win : number;
    revenue : number;
    status: number;
}


