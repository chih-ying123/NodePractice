import { Injectable, Logger } from '@nestjs/common';

import { Config, Dial, Loader, Log } from 'src/util';
import { IEnv } from './model/Env.interface';
import { IPlayerBetList } from './model/res.interface';
import { BetInfo } from './model/BetInfo';

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

    // WriteToFile 加入 log 檔寫入
    public WriteToFile(data:any){
        Log.WriteToFile("sbo", data) ;
    }

    public async Save(list: IPlayerBetList[]) {
        let conn = null;
        try {
            conn = await Dial.GetSQLConn(Config.DB);
        }
        catch (err) {
            Logger.error(err)
            this.WriteToFile(err) ;
        }
        if (conn == null) throw new Error("no sql conn !!");
        
        var max = list.length;
        for (var i = 0; i < max; i++) {
            let x = list[i];
            let subBet = JSON.stringify(x.subBet).replace("'", "''");

            BetInfo.ToHtml(x);

            var cmd = `CALL NSP_BetData_Insert_SBO_Sport(
                "${x.refNo}", 
                "${x.username}", 
                "${x.sportType}", 
                "${moment(x.orderTime).format("YYYY-MM-DD HH:mm:ss")}",
                "${moment(x.winlostDate).format("YYYY-MM-DD HH:mm:ss")}",
                "${moment(x.modifyDate).format("YYYY-MM-DD HH:mm:ss")}",
                ${x.odds}, 
                "${x.oddsStyle}", 
                ${x.stake}, 
                ${x.actualStake}, 
                "${x.currency}", 
                "${x.status}", 
                ${x.winlose},
                ${x.turnover}, 
                ${x.isHalfWonLose}, 
                ${x.isLive}, 
                ${x.MaxWinWithoutActualStake}, 
                "${x.Ip}", 
                '${subBet}',
                "${BetInfo.ToHtml(x)}"
            );` ;

			//fs.appendFile('SBO_Sql.sql', cmd, 'utf8', err => { });

			await conn.query(cmd).catch(e => {
                Logger.debug(e, "SboService")
                this.WriteToFile(e);
                this.WriteToFile(cmd);
			});
        }

        conn.close();
    }

    /**
     * 以時間取得SBO注單
     * @param startDate 
     * @param endDate 
     */
    public GetTheirBetData(startDate: string, endDate: string) {
        // console.log("GetTheirBetData:", startDate, endDate);
        return new Promise<string>(res => {
            var request = require('request');
            /*let param = JSON.stringify(
                {
                    "companyKey": this.env.companyKey,
                    "serverId": this.env.serverId, 
                    "username": this.env.username, 
                    "betstatus": this.env.betStatus,
                    "Portfolio": this.env.Portfolio, 
                    "lang": this.env.lang,
                    "startDate": startDate,
                    "endDate": endDate
                })*/

            let param = JSON.stringify(
                {
                    "companyKey": this.env.companyKey,
                    "serverId": this.env.serverId, 
                    "username": this.env.username, 
                    "lang": this.env.lang,
                    "startDate": startDate,
                    "endDate": endDate
                })

            var options = {
                'method': 'POST',
                'url': `${this.env.API_URI}/${this.env.BETLIST}`,
                'headers': {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                form: {
                    param: param
                }
            };

            request(options, (error, response)=>{
                if (error) {
                    this.WriteToFile("SboService[GetTheirBetData]error")
                    this.WriteToFile(error) ;
                    Logger.log(error, "SboService[GetTheirBetData]");
                    res("");
                } else {
                    res(response.body);
                }
            });
        });
    }
}
