export interface IEnv {
    baseURI: string;
    getBetAPI: string;
    login: string;
    password: string;
}


export interface IbetDetails{
    id: number;
    sid: string;
    account: string;
    game_type: number;
    game_round: number;
    room_id: number;
    table_id: number;
    bet_result: string ;
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
    bullet_count: number;
}

