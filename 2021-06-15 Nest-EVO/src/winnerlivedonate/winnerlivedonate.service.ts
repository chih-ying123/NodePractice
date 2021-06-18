import { Injectable } from '@nestjs/common';

import { Config, Dial, Loader, Log, Common } from 'src/util';
import { IEnv } from './model/Env.interface';
import { IDonate } from './model/donate.interface';
import * as fs from 'fs'

@Injectable()
export class WinnerlivedonateService {
    constructor() {
        this.env = Loader.GetENV<IEnv>("./public/winnerlivedonate/env.json");
    }
    public static Active: boolean = false;
    private env: IEnv;

    public WriteToFile(data: any) {
        Log.WriteToFile("winnerlivedonate", data)
    }

    public async SaveDataIntoDB(betDatas: Array<IDonate>) {

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
            let un = data.username.substring(5, data.username.length)
            let cmd = `CALL NSP_Donate_Winner_Live(
                  '${data.dept_id}'
                , '${data.buyid}'
                , '${un}'
                , '${data.nickname}'
                , '${data.gamename}'
                , '${data.playkey}'
                , '${data.tablenum}'
                , '${data.money}'
                , '${data.time}'
                , '${data.dealerid}'
                , '${data.dealername}'
                , '${data.list_id}'
                , '${data.giftname}'
           );`

            //console.log(cmd);

            fs.appendFile('sqlError.sql', cmd, 'utf8', err => { });
            await conn.query(cmd).catch(e => console.log(e));

        }
        conn.close();
    }

    public GetTheirBetData(date: string) {

        let signStr = "api_id=" + this.env.API_SN + "&date=" + date;
        let md5SignStr = signStr + "&md5key=" + this.env.API_SECRET_KEY;
        let sign = Common.MD5(md5SignStr);
        // console.log(sign)
        return new Promise<string>((res, rej) => {
            var request = require('request');
            var options = {
                'method': 'POST',
                'url': `${this.env.API_URI}/lot_api/RewardListGet`,
                'headers': {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "api_id": this.env.API_SN,
                    "date": date,
                    "sign": sign

                })
            };
            //console.log(options)
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
