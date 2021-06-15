import { Injectable, Logger } from '@nestjs/common';
import { v1 as uuidV1 } from 'uuid';
import { Config, Dial, Loader, Log, Common } from 'src/util';
import { IEnv } from './model/Env.interface';
import { Connection } from 'typeorm';
import { Item, Result } from './model/res.interface';
import { BetInfo } from './model/BetInfo';
import moment = require('moment');

@Injectable()
export class TFGamingService {
    constructor() {
        this.env = Loader.GetENV<IEnv>("./public/TFGaming/env.json");
        BetInfo.init();
    }
    public static Active: boolean = false;
    private static Name: string = "TFGamingService";
    private env: IEnv;
    private conn: Connection;


    public WriteToFile(data: any) {
        Log.WriteToFile("TFGaming", data)
    }

    public async Save(...list: Result[]) {
        console.log('save')
        if (this.conn == null) {
            this.conn = await Dial.GetSQLConn(Config.DB);
            if (this.conn == null) {
                this.WriteToFile("[TFGamingService]build conn fail")
                return
            }
        }
        var max = list.length;
        for (var i = 0; i < max; i++) {
        let x = list[i];
        BetInfo.ToHtml(x);
        //=================單一注單[未結算]================
            if ((x.settlement_status == 'confirmed') && (x.is_combo == false) || (x.settlement_status == 'cancelled') && (x.is_combo == false)) {
            // console.log('單一注單[未結算]', `第${i}筆`,`注單號${x.id}`)
            var cmd =
                `CALL NSP_BetData_Insert_TFGaming(
                '${x.id}', 
                '${x.bet_selection}', 
                ${x.odds}, 
                '${x.currency}', 
                ${x.amount}, 
                '${x.game_type_name}', 
                '${x.game_market_name}', 
                '${x.market_option}', 
                '${x.map_num}', 
                '${x.bet_type_name}',
                '${x.competition_name}', 
                ${x.event_id}, 
                '${x.event_name}', 
                '${moment(x.event_datetime).utc().add(8, "h").format("YYYY-MM-DD HH:mm:ss")}',
                '${moment(x.date_created).utc().add(8, "h").format("YYYY-MM-DD HH:mm:ss")}',
                ${null},
                '${moment(x.modified_datetime).utc().add(8, "h").format("YYYY-MM-DD HH:mm:ss")}',
                '${x.settlement_status}', 
                "${x.result}", 
                "${x.result_status}", 
                ${x.earnings},
                ${x.handicap},
                ${x.is_combo},
                '${x.member_code}',
                ${x.is_unsettled},
                '${x.ticket_type}',
                ${x.malay_odds},
                ${x.euro_odds},
                ${x.member_odds},
                '${x.member_odds_style}',
                ${x.game_type_id},
                '${x.request_source}',
                ${null},
               "${BetInfo.ToHtml(x)}"
            );` ;
        }
        //=================單一注單[已結算]================ok
            if ((x.settlement_status == 'settled') && (x.is_combo == false) || (x.settlement_status == 'cancelled') && (x.is_combo == false)) {
            // console.log('單一注單[已結算]', `第${i}筆`,`注單號${x.id}`)
            var cmd = `CALL NSP_BetData_Insert_TFGaming(
                '${x.id}', 
                '${x.bet_selection}', 
                ${x.odds}, 
                '${x.currency}', 
                ${x.amount}, 
                '${x.game_type_name}', 
                '${x.game_market_name}', 
                '${x.market_option}', 
                '${x.map_num}', 
                '${x.bet_type_name}',
                '${x.competition_name}', 
                ${x.event_id}, 
                '${x.event_name}', 
                '${moment(x.event_datetime).utc().add(8, "h").format("YYYY-MM-DD HH:mm:ss")}',
                '${moment(x.date_created).utc().add(8, "h").format("YYYY-MM-DD HH:mm:ss")}',
                '${moment(x.settlement_datetime).utc().add(8, "h").format("YYYY-MM-DD HH:mm:ss")}',
                '${moment(x.modified_datetime).utc().add(8, "h").format("YYYY-MM-DD HH:mm:ss")}',
                '${x.settlement_status}', 
                "${x.result}", 
                "${x.result_status}", 
                ${x.earnings},
                ${x.handicap},
                ${x.is_combo},
                '${x.member_code}',
                ${x.is_unsettled},
                '${x.ticket_type}',
                ${x.malay_odds},
                ${x.euro_odds},
                ${x.member_odds},
                '${x.member_odds_style}',
                ${x.game_type_id},
                '${x.request_source}',
                ${null},
                "${BetInfo.ToHtml(x)}"
            );` ;
        }
        //=================連串注單[未結算]================
            if ((x.settlement_status == 'confirmed') && (x.is_combo == true) || (x.settlement_status == 'cancelled') && (x.is_combo == true)) {
                let tickets = JSON.stringify(x.tickets).replace("'", "''")
            // console.log('連串注單[未結算]',`第${i}筆`,`注單號${x.id}`)
            var cmd = `CALL NSP_BetData_Insert_TFGaming(
                '${x.id}', 
                ${null}, 
                ${x.odds}, 
                '${x.currency}', 
                ${x.amount}, 
                ${null}, 
                ${x.game_market_name}, 
                ${x.market_option}, 
                ${x.map_num}, 
                ${x.bet_type_name},
                ${null}, 
                ${x.event_id}, 
                ${null}, 
                '${moment(x.event_datetime).utc().add(8, "h").format("YYYY-MM-DD HH:mm:ss")}',
                '${moment(x.date_created).utc().add(8, "h").format("YYYY-MM-DD HH:mm:ss")}',
                ${null}, 
                '${moment(x.modified_datetime).utc().add(8, "h").format("YYYY-MM-DD HH:mm:ss")}',
                '${x.settlement_status}', 
                ${null}, 
                "${x.result_status}", 
                ${x.earnings},
                ${null},
                ${x.is_combo},
                '${x.member_code}',
                ${x.is_unsettled},
                ${null},
                ${x.malay_odds},
                ${x.euro_odds},
                ${x.member_odds},
                '${x.member_odds_style}',
                ${null},
                '${x.request_source}',
                '${tickets}',
                "${BetInfo.ToHtml(x)}"
            );` ;
        }
        //=================連串注單[已結算]================OK
            if ((x.settlement_status == 'settled') && (x.is_combo == true) || (x.settlement_status == 'cancelled') && (x.is_combo == true)) {
                let tickets = JSON.stringify(x.tickets).replace("'", "''")
            // console.log('連串注單[已結算]', `第${i}筆`,`注單號${x.id}`)
            var cmd = `CALL NSP_BetData_Insert_TFGaming(
                '${x.id}', 
                ${null}, 
                ${x.odds}, 
                '${x.currency}', 
                ${x.amount}, 
                ${null}, 
                ${x.game_market_name}, 
                ${x.market_option}, 
                ${x.map_num}, 
                ${x.bet_type_name},
                ${null}, 
                ${x.event_id}, 
                ${null}, 
                '${moment(x.event_datetime).utc().add(8, "h").format("YYYY-MM-DD HH:mm:ss")}',
                '${moment(x.date_created).utc().add(8, "h").format("YYYY-MM-DD HH:mm:ss")}',
                '${moment(x.settlement_datetime).utc().add(8, "h").format("YYYY-MM-DD HH:mm:ss")}',
                '${moment(x.modified_datetime).utc().add(8, "h").format("YYYY-MM-DD HH:mm:ss")}',
                '${x.settlement_status}', 
                ${null}, 
                "${x.result_status}", 
                ${x.earnings},
                ${null},
                ${x.is_combo},
                '${x.member_code}',
                ${x.is_unsettled},
                ${null},
                ${x.malay_odds},
                ${x.euro_odds},
                ${x.member_odds},
                '${x.member_odds_style}',
                ${null},
                '${x.request_source}',
                '${tickets}',
                "${BetInfo.ToHtml(x)}"
            );` ;
        }
        // console.log(cmd);
        this.conn.query(cmd).catch(e => {
            Logger.debug(e, "TFGamingService")
            this.WriteToFile(e);
            this.WriteToFile(cmd);
        });
        }
        // conn.close();
    }
    

    // 取得 下注資訊
    public GetTheirBetData(pIdx: number, pSize: number, st: string, et: string) {
        // @see https://github.com/request/request#requestoptions-callback

        var id = uuidV1()

        return new Promise<string>((res, rej) => {
            var request = require('request');
            var options = {
                method: 'GET',
                url: `${this.env.API_URI}/api/v2/bet-transaction/`,
                qs:
                {
                    from_modified_datetime: st,
                    to_modified_datetime: et,
                    page: pIdx,
                    page_size: pSize
                },
                headers:
                {
                    authorization: `Token ${this.env.API_KEY}`
                }
            };
            // console.log(options)

            request(options, (error, response) => {
                if (error) {
                    res('');
                    this.WriteToFile(error);
                }
                else res(response.body);
            });

        });
    }
}
