import { Injectable, Logger } from '@nestjs/common';
import { v1 as uuidV1 } from 'uuid';
import { Config, Dial, Loader, Log, Common } from 'src/util';
import { IEnv } from './model/Env.interface';
import { Connection } from 'typeorm';
import { Result, item, IResTheirData } from './model/res.interface';
import moment = require('moment');

@Injectable()
export class V8PockerService {
    constructor() {
        this.env = Loader.GetENV<IEnv>("./public/V8Pocker/env.json");
    }
    public static Active: boolean = false;
    private static Name: string = "V8PockerService";
    private env: IEnv;
    private conn: Connection;

    public WriteToFile(data: any) {
        Log.WriteToFile("V8Pocker", data)
    }
    public async Save(list: Result) {
        console.log('save')
        if (this.conn == null) {
            this.conn = await Dial.GetSQLConn(Config.DB);
            if (this.conn == null) {
                this.WriteToFile("[V8PockerService]build conn fail")
                return
            }
        }
        let total = list.count;
       
        for (var i = 0; i < total; i++) {
       
            let DataList = list.list;
            // console.log('DataList', DataList.GameID[0])
            // let Accounts = DataList.Accounts[i].replace('70142_', '')
             let Accounts = DataList.Accounts[i].replace('80218_', '')
            var cmd =
                `CALL NSP_BetData_Insert_V8(
                "${DataList.GameID[i]}",
                "${Accounts}", 
                ${DataList.ServerID[i]},
                ${DataList.KindID[i]},
                ${DataList.TableID[i]}, 
                ${DataList.ChairID[i]}, 
                ${DataList.UserCount[i]},
                "${DataList.CardValue[i]}",
                ${DataList.CellScore[i]}, 
                ${DataList.AllBet[i]}, 
                ${DataList.Profit[i]},
                ${DataList.Revenue[i]}, 
                "${DataList.GameStartTime[i]}", 
                "${DataList.GameEndTime[i]}", 
                ${DataList.ChannelID[i]}, 
                "${DataList.LineCode[i]}"
   
            );` ;
            // console.log(cmd);
            this.conn.query(cmd).catch(e => {
                Logger.debug(e, "V8PockerService")
                this.WriteToFile(e);
                this.WriteToFile(cmd);
            });
        }
        // conn.close();
    }


    // 取得 下注資訊
    public async GetTheirBetData(st: number, et: number) {
        var request = require('request');
        var timestamp = new Date().getTime();
        let data = `s=6&startTime=${st}&endTime=${et}`;
        let AES = Common.encrypt(data, this.env.API_Deskey, null)
        let MD5str = this.env.API_AgentID + timestamp + this.env.API_Md5key
        var options = {
            'method': 'GET',
            'url': `${this.env.API_URI}/getRecordHandle`,
            qs:
            {
                agent: this.env.API_AgentID,
                timestamp: timestamp,
                param: AES,
                key: Common.MD5(MD5str)
            }

        };
        // console.log(options)
        return new Promise<string>((res, rej) => {
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
