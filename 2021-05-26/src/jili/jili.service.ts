import { Injectable, Body, Query, Logger } from '@nestjs/common';
import * as moment from 'moment';
import { Config, Dial, Loader, Log } from 'src/util';
import { v1 as uuidV1 } from 'uuid';
import { IEnv } from './model/Env.interface';
import { Common } from '../util/Common'
import { Connection } from 'typeorm';
import { ResponseList } from './model/res.interface';

@Injectable()
export class JiliService {
    constructor() {
        this.env = Loader.GetENV<IEnv>("./public/jili/env.json");
    }
    public static Active: boolean = false;
    private env: IEnv;
    private conn: Connection;

    public WriteToFile(data: any) {
        Log.WriteToFile("Jili", data)
    }
    public async Save(...list: ResponseList[]) {

        if (this.conn == null) {
            this.conn = await Dial.GetSQLConn(Config.DB);
            if (this.conn == null) {
                this.WriteToFile("[JILIService]build conn fail")
                return
            }
        }
        list.forEach(e => {
            // console.log('e', e)
            for (let x of e.Result) {
                //e.Result.forEach(x => {
                let WagersTime = moment(x.WagersTime).utc().add(8, "h").format(Common.Formatter_Moment_1);
                let PayoffTime = moment(x.PayoffTime).utc().add(8, "h").format(Common.Formatter_Moment_1);
                let SettlementTime = moment(x.SettlementTime).utc().add(8, "h").format(Common.Formatter_Moment_1);
                let Account = x.Account.replace("VI_","");
                let cmd = `CALL NSP_BetData_Insert_JILI(
                "${Account}",
                "${x.WagersId}",
                "${x.GameId}",
                "${WagersTime}",
                "${(Math.abs(x.BetAmount))}",
                "${PayoffTime}",
                "${x.PayoffAmount}",
                "${x.Status}",
                "${SettlementTime}",
                "${x.GameCategoryId}",
                "${x.VersionKey}",
                "${x.Jackpot}",
                "${x.Type}"
           );`;
                // console.log(cmd)
                this.conn.query(cmd).catch(e => {
                    Logger.debug(e, "JILIService")
                    this.WriteToFile(e);
                    this.WriteToFile(cmd);
                });
            //});
            }

        });

    }
    //製作MD5
    public generateKey(startDateTime, endDateTime, pageIndex, pageSize) {
        let now = moment().utc().subtract(4, "h").format("GGMMD");
        let keyG = Common.MD5(`${now}${this.env.API_AgentId}${this.env.API_SECRET_KEY}`);
        let querystring = `StartTime=${startDateTime}&EndTime=${endDateTime}&Page=${pageIndex}&PageLimit=${pageSize}&AgentId=${this.env.API_AgentId}`
        let md5string = Common.MD5(`${querystring}${keyG}`)
        let randomText1 = uuidV1().replace(/-/g, '').substr(6, 6);
        let randomText2 = uuidV1().replace(/-/g, '').substr(6, 6);
        let key = randomText1 + md5string + randomText2;
        return key;
    }
    public GetTheirBetData(pIdx: number, pSize: number, st: string, et: string) {

        // @see https://github.com/request/request#requestoptions-callback

        return new Promise<string>((res, rej) => {
            var request = require('request');
            var options = {
                'method': 'POST',
                'url': `${this.env.API_URI}GetBetRecordByTime`,
                'headers': {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                form: {
                    "AgentId": this.env.API_AgentId,
                    "Key": this.generateKey(st, et, pIdx, pSize),
                    "StartTime": st,
                    "EndTime": et,
                    "Page": pIdx,
                    "PageLimit": pSize,
                    "GameId": "",
                    "FilterAgent": "1"
                }
            };
            console.log(options);
            request(options, function (error, response) {
                if (error) {
                    Log.WriteToFile("Jili", "JILIService[GetTheirBetData]error")
                    Log.WriteToFile("Jili", error);
                    Logger.log(error, "JILIService[GetTheirBetData]");
                    res('');
                }
                else res(response.body);
            });

        });

    }
}
