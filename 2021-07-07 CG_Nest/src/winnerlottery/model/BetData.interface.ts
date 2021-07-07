export interface APIResponse {
    error_code: string;
    data: Array<IBetData>
}

export interface IBetData {
    buyid: string;
    username: string;
    code: string;
    playkey: string;
    list_id: string;
    period: string;
    nums: string;
    money: string;
    pri_money: string;
    z_buy_rate: string;
    pri_mode: string;
    pri_number: string;
    modes: string;
    z_number: string;
    status: string;
    created_at: string;
    prize_date: string;
    prize_time: string;
    handicaps: string;
    currency:string;
    number: string;
    currency_diff: string;
    errormsg: string;
    super_status: string;
    super_money: null
}

