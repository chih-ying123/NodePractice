import { Injectable, Logger } from '@nestjs/common';

import { Config, Dial, Loader, Log } from 'src/util';
import { IEnv } from './model/Env.interface';
import { ResTheirData } from './model/res.interface';
import { BetInfo } from './model/BetInfo';

import * as moment from 'moment';
import * as mysql from 'mysql';

@Injectable()
export class SboService {
    constructor() {
        this.env = Loader.GetENV<IEnv>("./public/SBO/env.json");
        BetInfo.init();
        //shell.exec(`node ${path.join(__dirname, "process", "main.js")}`, { async: true }); // 執行排程，採非同步
    }
    private static Duration: number = 5;
    public static Active: boolean = false;
    public static Date: string = ""; // 運行日期

     // WriteToFile 加入 log 檔寫入
     public WriteToFile(data:any){
        Log.WriteToFile("sbo", data) ;
    }
    
    private env: IEnv;

    public async Save(list: ResTheirData[]) {
        var conn = await Dial.GetSQLConn(Config.DB);
        if (conn == null) {
            this.WriteToFile("[SboService:conn]error") ;
            return ;
        }

        var max = list.length;
        for (var i = 0; i < max; i++) {
            let x = list[i];

            var cmd = `CALL NSP_BetData_Insert_SBO_Sport(
                ${x.bet_id},
                ${x.parent_bet_id},
                '${x.player_name}',
                '${x.vendor_code}',
                '${x.game_code}',
                '${x.trans_type}',
                '${x.currency}',
                '${x.wallet_code}',
                ${x.bet_amount},
                ${x.win_amount},
                ${x.turn_over},
                "${moment(x.created_at, "X").format('YYYY-MM-DD HH:mm:ss')}",
                '${x.traceId}',
                '${moment(x.orderTime, "X").format('YYYY-MM-DD HH:mm:ss')}',
                '${moment(x.winlostDate, "X").format('YYYY-MM-DD HH:mm:ss')}',
                '${x.modifyDate}',
                ${x.odds},
                ${mysql.escape(JSON.stringify({ subset: x.subBet }))},
                "${BetInfo.ToHtml(x)}"
            );` ;

            await conn.query(cmd).catch(e => {
                Logger.error(e)
                this.WriteToFile(e) ;
            });
        }

        conn.close();
    }

    /**
     * 以時間取得SBO注單
     * @param time 預設為0，之後可填入最後更新時間
     */
    public GetTheirAllBetData(time: number) {
        return new Promise<string>(res => {
            var request = require('request');
            var options = {
                'method': 'POST',
                'url': `${this.env.API_URI}/Bet/Record/Get`,
                'headers': {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(
                    { 
                        "secret_key": this.env.secret_key,
                        "operator_token": this.env.operator_token, 
                        "row_version": time, 
                        "count": 20000, 
                        "vendor_code":"SBO",
                        "timestamp_digit":10
                    })
            };

            request(options, (error, response)=>{
                if (error) {
                    this.WriteToFile("SBOService[GetToken]error")
                    this.WriteToFile(error) ;
                    Logger.log(error, "SBOService[GetToken]");
                    res("");
                } else {
                    res(response.body);
                }
            });
        });
    }

    /**
     * 以時間取得原廠細單
     * @param time 預設為0，之後可填入最後更新時間
     */
    public GetTheirDetailBetData(time: number) {
        return new Promise<string>(res => {
            var request = require('request');
            var options = {
                'method': 'POST',
                'url': `${this.env.API_URI}/Bet/Record/Detail`,
                'headers': {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(
                    { 
                        "secret_key": this.env.secret_key,
                        "operator_token": this.env.operator_token, 
                        "row_version": time, 
                        "count": 20000,
                        "vendor_code":"SBO",
                        "timestamp_digit":13,
                        "language": "en"
                    })
            };

            request(options, (error, response)=>{
                if (error) {
                    this.WriteToFile("SBOService[GetTheirDetailBetData]error")
                    this.WriteToFile(error) ;
                    Logger.log(error, "SBOService[GetTheirDetailBetData]");
                    res("");
                } else {
                    res(response.body);
                }
            });
        });
    }
}
