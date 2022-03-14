export interface IEnv {
    baseURI: string;
    getSlotBetAPI: string;
    secret_key: string;
}

export interface IAPIResponse{
    status: string ;
    code : string;
    message: string ;
    data: IData;
}

export interface IData{
    bet_details: IbetDetails[];
    page_index: number;
    page_size: number;
    total_elements: number;
    total_pages: number;
}

export interface IbetDetails{
    id: number;
    sid: string;
    account: string;
    game_type: number;
    game_round: number;
    bet: number;
    game_result: string;
    valid_bet: number;
    win: number;
    create_time: string;
    order_id: string;
    device: string;
    client_ip: string;
    c_type: string;
    profit: number;
}

