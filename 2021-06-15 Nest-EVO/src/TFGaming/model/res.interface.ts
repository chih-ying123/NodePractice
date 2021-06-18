
export interface IResTheirData {
    count: number;
    next: string;
    previous: string;
    results: Result[];
}

export interface IResTheirErrorData {
    errors: string;
    code: number;
}

export interface Result {
    id: string;
    bet_selection: string|null;
    odds: number;
    currency: string;
    amount: number;
    game_type_name: string;
    game_market_name: string;
    market_option: string;
    map_num: string;
    bet_type_name: string;
    competition_name: string;
    event_id: number;
    event_name: string;
    event_datetime: string;
    date_created: string;
    settlement_datetime: string | null;
    modified_datetime: string;
    settlement_status: string;
    result: string | null;
    result_status: string | null;
    earnings: number;
    handicap: number | null;
    is_combo: boolean;
    member_code: string;
    is_unsettled: boolean;
    ticket_type: string;
    malay_odds: number;
    euro_odds: number;
    member_odds: number;
    member_odds_style: string;
    game_type_id: number;
    request_source: string;
    tickets: Item[];
}

export interface Item {
    id: string;
    bet_selection: string;
    odds: number;
    currency: string;
    amount: number;
    game_type_name: string;
    game_market_name: string;
    market_option: string;
    map_num: string;
    bet_type_name: string;
    competition_name: string;
    event_id: number;
    event_name: string;
    event_datetime: string;
    date_created: string;
    settlement_datetime: string;
    modified_datetime: string;
    settlement_status: string;
    result: string;
    result_status: string;
    earnings: number;
    handicap: number;
    is_combo: boolean;
    member_code: string;
    is_unsettled: boolean;
    ticket_type: string;
    malay_odds: number;
    euro_odds: number;
    member_odds: number;
    member_odds_style: string;
    game_type_id: number;
    request_source: string;
}
