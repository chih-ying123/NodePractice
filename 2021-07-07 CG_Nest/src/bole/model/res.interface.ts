export namespace all_recorder {
    export interface IAllRecord {
        resp_msg: RespMsg;
        resp_data: RespData;
    }

    export interface RespData {
        count: Count;
        data: SubData[];
    }

    export interface Count {
        total: number;
        page: number;
        page_size: number;
        page_total: number;
    }

    export interface SubData {
        room_id: number;
        scene_id: number;
        gain_gold: number;
        own_gold: number;
        bet_num: number;
        report_id: string;
        bet_num_valid: number;
        income_gold: number;
        sn: string;
        id: number;
        game_id: number;
        game_code: string;
        player_account: string;
        end_time: number;
        start_time: number;
        init_gold: number;
        line_code: string;
        bet_valid_num: number;
        type: string;
    }

    export interface RespMsg {
        code: number;
        message: string;
    }

}

export namespace race_log {

    export interface IRaceLog {
        resp_msg: RespMsg;
        resp_data: RespData;
    }

    export interface RespData {
        data: Datum[];
        count: Count;
    }

    export interface Count {
        total: number;
        page: number;
        page_size: number;
    }

    export interface Datum {
        activity_time: number;
        ext: EXT;
        activity_name: string;
        total_enroll_gold: number;
        create_time: number;
        end_time: number;
        enroll_count: number;
        total_send_gold: number;
        player_count: number;
        report_id: string;
        total_pool_gold: number;
        activity_type: number;
        activity_id: number;
        total_income_gold: number;
        id: number;
        activity_sponsor: number;
        game_id: number;
        game_code: string;
        reward_count: number;
    }

    export interface EXT {
        reward: { string: Reward };
        enrolls: { string: Info };
        players: { string: Info };
    }

    export interface Reward {
        rank: number;
        reward: number; // 比赛获得奖金
        account_id: string; // 玩家账号
        operator_id: number;
    }

    export interface Info {
        nickname: string;
        account_id: string;
        operator_id: number;
    }

    export interface RespMsg {
        code: number;
        message: string;
    }
}