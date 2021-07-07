import { Injectable } from '@nestjs/common';
import { Config, Dial, Loader, Log, Common } from 'src/util';
import { IEnv } from './model/Env.interface';
import { IBetData } from './model/BetData.interface';
import * as fs from 'fs'

@Injectable()
export class WinnerlotteryService {
    constructor() {
        this.env = Loader.GetENV<IEnv>("./public/winnerlottery/env.json");
    }
    public static Active: boolean = false;
    private env: IEnv;

    public WriteToFile(data: any) {
        Log.WriteToFile("winnerlottery", data)
    }

    public async SaveDataIntoDB(betDatas: Array<IBetData>) {

        let conn = null;
        try {
            conn = await Dial.GetSQLConn(Config.DB);
        }
        catch (err) {
            console.log(err)
            fs.appendFile('dbError.txt', err, 'utf8', err => { });
        }

        if (conn == null) throw new Error("no sql conn !!");


        for (let data of betDatas) {
            let handicap = data.handicaps == null ? '' : data.handicaps;
            let un = data.username.substring(5, data.username.length)
            let cmd = `CALL NSP_BetData_Insert_Lottery(
                      '${data.buyid}'                   
                    , '${un}'
                    , '${data.code}'
                    , '${data.playkey}'
                    , '${data.list_id}'            
                    , '${data.period}'           
                    , '${data.number}' 
                    , '${data.nums}' 
                    , '${data.money}'            
                    , '${data.pri_money}'
                    , '${data.z_buy_rate}'
                    , '${data.pri_number}'
                    , '${data.modes}'
                    , '${data.z_number}'
                    , '${data.status}'
                    , '${data.created_at}'
                    , '${data.prize_time}'
                    , '${data.prize_date}'          
                    , '${data.handicaps}'
                    , '${data.currency}'
                    , '${data.currency_diff}'

            );`;

            console.log(cmd);

            fs.appendFile('sqlError.sql', cmd, 'utf8', err => { });
            await conn.query(cmd).catch(e => console.log(e));

        }
        conn.close();
    }
    // 取得 下注資訊
    public GetTheirBetData(date: string, type: string, pri_type: string) {

        // @see https://github.com/request/request#requestoptions-callback

        let signStr = "api_id=" + this.env.API_SN + "&date=" + date + "&type=" + type + "&pri_type=" + pri_type;
        let md5SignStr = signStr + "&md5key=" + this.env.API_SECRET_KEY;
        let sign = Common.MD5(md5SignStr);
        // console.log(sign)
        return new Promise<string>((res, rej) => {
            var request = require('request');
            var options = {
                'method': 'POST',
                'url': `${this.env.API_URI}/lot_api/BuyListGet`,
                'headers': {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "api_id": this.env.API_SN,
                    "date": date,
                    "pri_type": pri_type,
                    "sign": sign,
                    "type": type

                })
            };
            console.log(options)
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
