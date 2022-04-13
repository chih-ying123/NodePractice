// To parse this data:
//
//   import { Convert; IResTheirData } from ./file;
//
//   const iResTheirData = Convert.toIResTheirData(json);

export interface IResTheirData {
    code: number;
    msg: string;
    data: Result;
}
export interface Result {
    pagination_info: page;
    bet_record_list: Item[];
}
export interface page {
    total_pages: string;
    current_page: string;
    size: number;
    total_count: number;
}
export interface Item {
    record_id: string;
    created_at: string;
    updated_at: string;
    game_code: string;
    account: string;
    bet_status: number;
    base_bet: number;
    bet: number;
    bet_valid: number;
    profit: number;
    tax: number;
    balance: number;
    bonus: number;
    result: string;
    round_id: string;
    round_start_at: string;
    round_end_at: string;
    currency: string;
    category: string;
}
