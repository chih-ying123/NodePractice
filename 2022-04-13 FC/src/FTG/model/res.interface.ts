
export interface IResTheirData {
    total: number;
    page: number;
    row_number: number;
    rows: Result[];
}

export interface IResTheirErrorData {
    error_code: string;
    error_msg: string;
    info:code[];
}
export interface code{
    code: string;
}
export interface Result {
    bet_at: string;
    modified_at: string;
    payoff_at: string;
    id: number;
    round_date: string;
    lobby_id: string;
    game_id: number;
    game_group_id: number;
    device: number;
    device_version: string;
    bet_amount: number;
    profit: number;
    payoff: number;
    currency: string;
    username: string;
    result: string;
    commission: number;
    commissionable: number;
}


