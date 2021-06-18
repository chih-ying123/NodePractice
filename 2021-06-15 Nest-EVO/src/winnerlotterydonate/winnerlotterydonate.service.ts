import { Injectable } from '@nestjs/common';

import { Config, Dial, Loader, Log, Common } from 'src/util';
import { IEnv } from './model/Env.interface';
import { IDonate } from './model/donate.interface';
import * as fs from 'fs'

@Injectable()
export class WinnerlotterydonateService {
    constructor() {
        this.env = Loader.GetENV<IEnv>("./public/winnerlotterydonate/env.json");
    }
    public static Active: boolean = false;
    private env: IEnv;

    public WriteToFile(data: any) {
        Log.WriteToFile("winnerlotterydonate", data)
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
            let cmd = `CALL NSP_Donate_Winner_Lottery(
                  '${data.dept_id}'
                , '${data.buyid}'
                , '${data.time}'
                , '${un}'
                , '${data.playkey}'
                , '${data.list_id}'
                , '${data.listname}'
                , '${data.camgirl_id}'
                , '${data.girlname}'
                , '${data.money}'
           );`

            //console.log(cmd);

            fs.appendFile('sqlError.sql', cmd, 'utf8', err => { });
            await conn.query(cmd).catch(e => console.log(e));

        }
        conn.close();
    }

    public GetTheirBetData(date: string, username: string) {

        // @see https://github.com/request/request#requestoptions-callback

        //let signStr = "api_id=" + this.env.API_SN + "&date=" + date + "&username=" + username;
        let signStr = "api_id=" + this.env.API_SN + "&date=" + date;
        //let signStr = "api_id=" + this.env.API_SN;
        let md5SignStr = signStr + "&md5key=" + this.env.API_SECRET_KEY;
        let sign = Common.MD5(md5SignStr);
        // console.log(sign)
        return new Promise<string>((res, rej) => {
            var request = require('request');
            var options = {
                'method': 'POST',
                'url': `${this.env.API_URI}/lot_api/GiftListGet`,
                'headers': {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "api_id": this.env.API_SN,
                    "date": date,
                    //"username": username,
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
