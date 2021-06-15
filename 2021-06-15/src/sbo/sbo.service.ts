import { Injectable, Logger } from '@nestjs/common';

import { Config, Dial, Loader, Log } from 'src/util';
import { IEnv } from './model/Env.interface';
import { IPlayerBetList } from './model/res.interface';
import { BetInfo } from './model/BetInfo';
import { Connection } from 'typeorm';

import * as moment from 'moment';
import * as fs from 'fs'

@Injectable()
export class SboService {
    constructor() {
        this.env = Loader.GetENV<IEnv>("./public/SBO/env.json");
        BetInfo.init();
        //shell.exec(`node ${path.join(__dirname, "process", "main.js")}`, { async: true }); // 執行排程，採非同步
    }
    public static Active: boolean = false;
    public static Date: string = ""; // 運行日期

    private env: IEnv;
    private conn: Connection;

    // WriteToFile 加入 log 檔寫入
    public WriteToFile(data: any) {
        Log.WriteToFile("sbo", data);
    }

    public async Save(list: IPlayerBetList[]) {

        if (this.conn == null) {
            this.conn = await Dial.GetSQLConn(Config.DB);
            if (this.conn == null) {
                this.WriteToFile("[SBOService]build conn fail")
                return
            }
        }
        var max = list.length;
        for (var i = 0; i < max; i++) {
            let x = list[i];
            let subBet = JSON.stringify(x.subBet).replace("'", "''");

            BetInfo.ToHtml(x);

            var cmd = `CALL NSP_BetData_Insert_SBO_Sport(
                0,
                "${x.refNo}", 
                "${x.username}", 
                "${x.sportsType}", 
                "${moment(x.orderTime).format("YYYY-MM-DD HH:mm:ss")}",
                "${moment(x.winLostDate).format("YYYY-MM-DD HH:mm:ss")}",
                "${moment(x.modifyDate).format("YYYY-MM-DD HH:mm:ss")}",
                "${moment(x.settleTime).format("YYYY-MM-DD HH:mm:ss")}",
                ${x.odds}, 
                "${x.oddsStyle}", 
                ${x.stake}, 
                ${x.actualStake}, 
                "${x.currency}", 
                "${x.status}", 
                ${x.winLost},
                ${x.turnover}, 
                ${x.isHalfWonLose}, 
                ${x.isLive}, 
                ${x.maxWinWithoutActualStake}, 
                "${x.ip}", 
                '${subBet}',
                "${BetInfo.ToHtml(x)}",
                ${x.isSystemTagRisky}, 
                ${x.isCustomerTagRisky}, 
                0
            );` ;
                // console.log(cmd);
            this.conn.query(cmd).catch(e => {
                Logger.debug(e, "SBOService")
                this.WriteToFile(e);
                this.WriteToFile(cmd);
            });
        }

    }

    /**
     * 以時間取得SBO注單
     * @param startDate 
     * @param endDate 
     */
    public GetTheirBetData(startDate: string, endDate: string) {
        // console.log("GetTheirBetData:", startDate, endDate);
        var request = require('request');
        var options = {
            'method': 'POST',
            'url': `${this.env.API_URI}/${this.env.BETLIST}`,
            'headers': {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                "CompanyKey": this.env.companyKey,
                "ServerId": this.env.serverId,
                "Username": this.env.username,
                "Portfolio": this.env.Portfolio,
                "Language": this.env.lang,
                "StartDate": startDate,
                "EndDate": endDate
            })
        };
        return new Promise<string>(res => {
            // console.log(options)
            request(options, (error, response) => {
                if (error) {
                    this.WriteToFile("SboService[GetTheirBetData]error")
                    this.WriteToFile(error);
                    Logger.log(error, "SboService[GetTheirBetData]");
                    res("");
                } else {
                    res(response.body);
                }
            });
        });
    }
}
