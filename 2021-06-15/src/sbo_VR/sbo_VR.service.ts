import { Injectable, Logger } from '@nestjs/common';

import { Config, Dial, Loader, Log } from 'src/util';
import { IEnv } from './model/Env.interface';
import { IPlayerBetList } from './model/res.interface';
import { BetInfo } from './model/BetInfo';
import { Connection } from 'typeorm';

import * as moment from 'moment';

@Injectable()
export class sbo_VRService {
    constructor() {
        this.env = Loader.GetENV<IEnv>("./public/sbo_VR/env.json");
        BetInfo.init();
        //shell.exec(`node ${path.join(__dirname, "process", "main.js")}`, { async: true }); // 執行排程，採非同步
    }
    public static Active: boolean = false;
    public static Date: string = ""; // 運行日期

    private env: IEnv;
    private conn: Connection;

    // WriteToFile 加入 log 檔寫入
    public WriteToFile(data:any){
        Log.WriteToFile("sbo_VR", data) ;
    }

    public async Save(list: IPlayerBetList[]) {

        if (this.conn == null) {
            this.conn = await Dial.GetSQLConn(Config.DB);
            if (this.conn == null) {
                this.WriteToFile("[sbo_VR_Service]build conn fail")
                return
            }
        }
        var max = list.length;
        for (var i = 0; i < max; i++) {
            let x = list[i];
            let subBet = JSON.stringify(x.subBet).replace("'", "''");

            BetInfo.ToHtml(x);

            var cmd = `CALL NSP_BetData_Insert_SBO_Sport(
                1,
                "${x.refNo}", 
                "${x.username}", 
                "${x.productType}", 
                "${moment(x.orderTime).format("YYYY-MM-DD HH:mm:ss")}",
                "${moment(x.winLostDate).format("YYYY-MM-DD HH:mm:ss")}",
                "${moment(x.modifyDate).format("YYYY-MM-DD HH:mm:ss")}",
                "${moment(x.settleTime).format("YYYY-MM-DD HH:mm:ss")}",
                ${x.odds}, 
                "${x.oddsStyle}", 
                ${x.stake}, 
                ${x.actualStake}, 
                "", 
                "${x.status}", 
                ${x.winLost},
                ${x.turnover}, 
                0, 
                0, 
                0, 
                "", 
                '${subBet}',
                "${BetInfo.ToHtml(x)}",
                0, 
                0, 
                "${x.gameId}"
            );` ;
            // console.log(cmd);
            this.conn.query(cmd).catch(e => {
                Logger.debug(e, "SBO_VR_Service")
                this.WriteToFile(e);
                this.WriteToFile(cmd);
            });
        }

    }

    /**
     * 以時間取得sbo_VR注單
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
            request(options, (error, response)=>{
                if (error) {
                    this.WriteToFile("sbo_VRService[GetTheirBetData]error")
                    this.WriteToFile(error) ;
                    Logger.log(error, "sbo_VRService[GetTheirBetData]");
                    res("");
                } else {
                    res(response.body);
                }
            });
        });
    }
}
