import { Injectable, Logger } from '@nestjs/common';

import { Common, Config, Dial, Loader, Log } from 'src/util';
import { IEnv } from './model/env.interface';
import { Item } from './model/res.interface';

import * as moment from 'moment';

@Injectable()
export class RTGService {
    constructor() {
        this.env = Loader.GetENV<IEnv>("./public/rtg/env.json");
        // let params = path.join(__dirname, "process", "main.js") ;
        // shell.exec(`node "${params}"`, { async: true }); // 執行排程，採非同步
    }
    private static Duration: number = 5;

    private env: IEnv;

    // WriteToFile 加入 log 檔寫入
    public WriteToFile(data:any){
        Log.WriteToFile("rtg", data) ;
    }

    public async Save(list: Item[]) {
        var conn = await Dial.GetSQLConn(Config.DB);
        if (conn == null) {
            Logger.error("[RTGService]conn_error");
            this.WriteToFile("[RTGService]conn_error") ;
            return
        }

        var max = list.length;
        for (var i = 0; i < max; i++) {
            let x = list[i];

            var cmd = `CALL NSP_BetData_Insert_RTG(
                "${x.agentId}",
                "${x.agentName}",
                "${x.casinoPlayerId}",
                "${x.casinoId}",
                "${x.playerName}",
                "${moment(x.gameDate).format("YYYY-MM-DD HH:mm:ss")}",
                "${moment(x.gameStartDate).format("YYYY-MM-DD HH:mm:ss")}",
                ${x.gameNumber},
                "${x.gameName}",
                "${x.gameId}",
                "${x.gameNameId}",
                ${x.bet},
                ${x.win},
                ${x.payout},
                ${x.jpBet},
                ${x.jpWin},
                "${x.currency}",
                "${x.roundId}",
                ${x.balanceStart},
                ${x.balanceEnd},
                "${x.platform}",
                ${x.externalGameId},
                ${x.sideBet},
                ${x.featureContribution},
                ${x.featurePayout},
                "${x.featureTypeName}",
                "${x.scatterWon}",
                ${x.winLossAmount},
                ${x.gameTechnologyId},
                "${x.betIpAddress}",
                ${x.id}
            );` ;

            await conn.query(cmd).catch(e => {
                Logger.debug(e, "RTGService")
                this.WriteToFile(e);
                this.WriteToFile(cmd);
            });
        }
        conn.close();
    }
    public GetToken() {
        return new Promise<string>(res => {
            var request = require('request');
            var options = {
                'method': 'GET',
                'url': `${this.env.API_URI}/api/start/token?username=${this.env.API_USER}&password=${this.env.API_PW}`,
                'headers': {}
            };
            request(options, (error, response)=>{
                if (error) {
                    this.WriteToFile("RTGService[GetToken]error")
                    this.WriteToFile(error) ;
                    Logger.log(error, "RTGService[GetToken]");
                    res("");
                } else res(response.body);
            });
        });
    }
    public GetTheirBetData(token: string, from: string, to: string) {
        return new Promise<string>(res => {

            var request = require('request');
            var options = {
                'method': 'POST',
                'url': `${this.env.API_URI}/api/report/playergame`,
                'headers': {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
                body: JSON.stringify({ "params": { "agentId": this.env.API_AGENTID, "fromDate": from, "toDate": to } })
            };
            request(options, (error, response)=>{
                if (error) {
                    this.WriteToFile("RTGService[GetTheirBetData]error")
                    this.WriteToFile(error) ;
                    Logger.log(error, "RTGService[GetTheirBetData]");
                    res("");
                } else res(response.body);
            });

        });
    }
    public Get2Days(date: string): Array<{ start: string, end: string }> { // 取得 2天份 ( 昨日+今日 )
        let m = moment();
        date = m.format(Common.Formatter_Moment_0);
        let list = Common.dateSplitByMin(date, RTGService.Duration);

        m.add(-1, "days");
        date = m.format(Common.Formatter_Moment_0);
        list.concat(Common.dateSplitByMin(date, RTGService.Duration));
        return list;
    }
}
