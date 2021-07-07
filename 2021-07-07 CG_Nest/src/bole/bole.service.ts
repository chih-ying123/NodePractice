import { Injectable, Logger } from '@nestjs/common';
import { v1 as uuidv1 } from 'uuid';
import * as moment from 'moment';

import { Config, Dial, Loader, Common, Log } from 'src/util';
import { IEnv } from './model/Env.interface';
import { all_recorder, race_log } from './model/res.interface';

import * as fs from 'fs';

import Mustache = require('mustache');

type params = { [key: string]: any };

@Injectable()
export class BoleService {
    constructor() {
        this.env = Loader.GetENV<IEnv>("./public/bole/env.json");
        this.template = fs.readFileSync("./public/bole/template/race_log.html",{encoding: 'utf8'})
        
    }
    private static Time_Format : string = "YYYY-MM-DD HH:mm:ss"

    private env: IEnv;

    // WriteToFile 加入 log 檔寫入
    public WriteToFile(data:any){
        Log.WriteToFile("bole", data) ;
    }

    public async SaveBetData(data: all_recorder.SubData, res: string) {
        if (res.length == 0) {
            Logger.debug("error:bole:no_detail", "BoleService")
            return
        }

        var conn = await Dial.GetSQLConn(Config.DB);
        if (conn == null) {
            this.WriteToFile("[BoleService:conn]error")
            return ;
        }

        var cmd = `CALL NSP_BetData_Insert_Bole(
            ${data.room_id}
            ,${data.scene_id}
            ,${data.gain_gold}
            ,${data.own_gold}
            ,${data.bet_num}
            ,'${data.report_id}'
            ,${data.bet_num_valid}
            ,${data.income_gold}
            ,${data.id}
            ,'${data.sn}'
            ,${data.game_id}
            ,'${data.game_code}'
            ,'${data.player_account}'
            ,'${moment(data.end_time * 1000).format(BoleService.Time_Format)}'
            ,'${moment(data.start_time * 1000).format(BoleService.Time_Format)}'
            ,${data.init_gold}
            ,${data.bet_valid_num}
            ,'${data.type}'
            ,'${res}'
        );` ;

        await conn.query(cmd).catch(e => {
            Logger.debug(e, "BoleService")
            this.WriteToFile(e) ;
            this.WriteToFile(cmd) ;
        });
        conn.close();
    }

    private newParams(merge: any = null): params {
        var timestamp = moment().unix();
        var nonce = Common.MD5(`${uuidv1()}`);
        var sign = Common.SHA1(`${this.env.API_ACCESS_KEY_SERECT}${nonce}${timestamp}`).toLowerCase();

        var dist = {
            'AccessKeyId': this.env.API_ACCESS_KEY_ID,
            'Timestamp': timestamp,
            'Nonce': nonce,
            'Sign': sign
        }

        if (merge != null) {
            for (var key in merge) {
                dist[key] = merge[key]
            }
        }

        return dist
    }

    private getAllRecord(params: params) {
        return new Promise<string>((res, rej) => {
            var request = require('request');
            var options = {
                // 'timeout': 15000, // 15 sec
                'method': 'POST',
                'url': `${this.env.API_URI}/v1/game/get_all_record_list`,
                'headers': {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                form: params
            };

            request(options, (error, response)=>{
                if (error) {
                    this.WriteToFile("BoleService[getAllRecord]error")
                    this.WriteToFile(error) ;
                    Logger.log(error, "BoleService[getAllRecord]");
                    res("");
                } else res(response.body);
            });

        });
    }

    public GetAllRecord(start: string, end: string) {
        return new Promise<all_recorder.SubData[]>(async (res, rej) => {

            var index = 1
            var total = Number.MAX_SAFE_INTEGER

            var default_params = {}
            default_params['start_time'] = moment(start).unix();
            default_params['end_time'] = moment(end).unix();
            default_params['page'] = index;
            default_params['page_size'] = 10000;

            let list = []

            var first_res = await this.getAllRecord(this.newParams(default_params))
            if (first_res == "") {
                res(list);
                return;
            }

            var first_data = <all_recorder.IAllRecord>JSON.parse(first_res)
            if (first_data.resp_msg.code != 200) {
                Logger.log(first_data, "BoleService[GetAllRecord]");
                res(list);
                return;
            }

            list = list.concat(first_data.resp_data.data);
            total = first_data.resp_data.count.page_total; // set first value

            // stop when ( page > page_total )
            while (index < total) {
                default_params['page'] = index++
                let res = await this.getAllRecord(this.newParams(default_params))
                if (res == "") continue

                let data = <all_recorder.IAllRecord>JSON.parse(res)
                if (data.resp_msg.code != 200) {
                    this.WriteToFile("BoleService[GetAllRecord]resp_msg.code != 200");
                    Logger.log(data, "BoleService[GetAllRecord]");
                    continue
                }

                list = list.concat(data.resp_data.data)

            }

            res(list);
        });
    }

    public GetPlayBack(data: all_recorder.SubData) {
        var params = {}
        params['player_account'] = data.player_account;
        params['report_id'] = data.report_id;
        params['response_type'] = 2;

        return new Promise<string>((res, rej) => {
            var request = require('request');
            var options = {
                // 'timeout': 15000, // 15 sec
                'method': 'POST',
                'url': `${this.env.API_URI}/v1/game/get_playback`,
                'headers': {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                form: this.newParams(params)
            };

            request(options, (error, response)=>{
                if (error) {
                    this.WriteToFile("BoleService[GetPlayBack]error")
                    this.WriteToFile(error)
                    Logger.log(error, "BoleService[GetPlayBack]");
                    res("");
                } else res(response.body);
            });

        });
    }

    public GetMultiRecordDetails(data: all_recorder.SubData) {
        var params = {}
        params['id'] = data.id;
        params['end_time'] = data.end_time;
        params['response_type'] = 2;

        return new Promise<string>((res, rej) => {
            var request = require('request');
            var options = {
                // 'timeout': 15000, // 15 sec
                'method': 'POST',
                'url': `${this.env.API_URI}/v1/game/get_multi_record_details`,
                'headers': {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                form: this.newParams(params)
            };

            request(options, (error, response)=>{
                if (error) {
                    this.WriteToFile("BoleService[GetMultiRecordDetails]error")
                    this.WriteToFile(error)
                    Logger.log(error, "BoleService[GetMultiRecordDetails]");
                    res("");
                } else res(response.body);
            });

        });
    }

    private getRaceLog(params: params) {
        return new Promise<string>((res, rej) => {

            let request = require('request');
            var options = {
                // 'timeout': 15000, // 15 sec
                'method': 'POST',
                'url': `${this.env.API_URI}/v1/activity/get_race_log`,
                'headers': {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                form: params
            };

            request(options, (error, response) =>{
                if (error) {
                    this.WriteToFile("BoleService[getRaceLog]error")
                    this.WriteToFile(error)
                    Logger.debug(error, "BoleService")
                    res("");
                } else res(response.body);
            });

        });
    }

    private template : string
    public async SaveRaceLog(data: race_log.Datum, player : race_log.Reward) {

        var conn = await Dial.GetSQLConn(Config.DB);
        if (conn == null) return

        let st = moment(data.create_time * 1000).format(BoleService.Time_Format)
        var cmd = `CALL NSP_BetData_Insert_Bole_Race(
            '${st}'
            ,'${moment(data.end_time * 1000).format(BoleService.Time_Format)}'
            ,'${data.report_id}'
            ,${data.id}
            ,${data.game_id}
            ,'${data.game_code}'
            ,${player.reward}
            ,'${player.account_id}'
            ,'${Mustache.render(this.template, {
                "activity_name":data.activity_name,
                "time" : st,
                "reward" : player.reward
            })}'
        );` ;

        // Txt.Make(`./dist/bole/sql/${data.id}.sql.txt`).Write(cmd)
        // if (this.debug) {
        //     Txt.Make(`./dist/bole/sql/${data.id}.sql.txt`).Write(cmd)
        //     Txt.Make(`./dist/bole/sql/${data.id}.src.json`).Write(JSON.stringify(data))
        // }

        await conn.query(cmd).catch(e => {
            Logger.debug(e, "BoleService[SaveRaceLog]")
            this.WriteToFile("BoleService[SaveRaceLog]error")
            this.WriteToFile(e)
        });
        conn.close();
    }

    public getTestRaceLog():string{
        return `
        {
            "resp_msg": {
                "code": 200,
                "message": "success"
            },
            "resp_data": {
                "data": [{
                    "activity_time": 1584190800,
                    "ext": {
                        "reward": {
                            "0": {
                                "rank": 1,
                                "reward": 1500,
                                "account_id": "WR101",
                                "operator_id": 1
                            }
                        },
                        "enrolls": {
                            "2": {
                                "nickname": "test1234",
                                "account_id": "test1234",
                                "operator_id": 1
                            }
                        },
                        "players": {
                            "2": {
                                "nickname": "test1234",
                                "account_id": "test1234",
                                "operator_id": 1
                            }
                        }
                    },
                    "activity_name": "【周六】雀王争霸战-免费赛",
                    "total_enroll_gold": 0,
                    "create_time": 1584192717,
                    "end_time": 1584192717,
                    "enroll_count": 50,
                    "total_send_gold": 2000,
                    "player_count": 25,
                    "report_id": "10002-2-1584190200275-42257346",
                    "total_pool_gold": 3000,
                    "activity_type": 1,
                    "activity_id": 2,
                    "total_income_gold": -2000,
                    "id": 33,
                    "activity_sponsor": 2,
                    "game_id": 10002,
                    "game_code": "mjxzdd",
                    "reward_count": 3
                }],
                "count": {
                    "total": 29,
                    "page": 1,
                    "page_size": 50
                }
            }
        }
        `
    }

    public GetRaceLog(start: string, end: string) {
        return new Promise<race_log.Datum[]>(async (res, rej) => {

            var index = 1
            var total = Number.MAX_SAFE_INTEGER

            var default_params = {}
            default_params['start_time'] = moment(start).unix();
            default_params['end_time'] = moment(end).unix();
            default_params['page'] = index;
            default_params['page_size'] = 10000;

            let list = []

            let p = this.newParams(default_params)
            var race_res = await this.getRaceLog(p)

            // var race_res = this.getTestRaceLog()

            if (race_res == "") {
                res(list);
                return;
            }

            try{
                var _res = <race_log.IRaceLog>JSON.parse(race_res)
                if (_res.resp_msg.code != 200) {
                    Logger.log(_res, "BoleService[GetRaceLog]");
                    res(list);
                    return;
                }
    
                list = list.concat(_res.resp_data.data);
                total = _res.resp_data.count.total; // set first value
    
                // stop when ( page > page_total )
    
                // while (index < total) {
                //     default_params['page'] = index++
                //     let res = await this.getAllRecord(this.newParams(default_params))
                //     if (res == "") continue
    
                //     let data = <race_log.IRaceLog>JSON.parse(res)
                //     if (data.resp_msg.code != 200) {
                //         Logger.log(`error_bole_GetRaceLog`, "BoleService");
                //         Logger.log(data, "BoleService");
                //         continue
                //     }
    
                //     list = list.concat(data.resp_data.data)
    
                // }
    
                res(list);
            }catch(e){
                this.WriteToFile("BoleService[GetRaceLog]error")
                this.WriteToFile(e)
                Logger.log(e.message, "BoleService[GetRaceLog]");
            }
            
        });
    }

}
