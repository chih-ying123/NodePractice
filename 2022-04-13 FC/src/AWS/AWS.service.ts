import { Injectable, Logger } from '@nestjs/common';
import { v1 as uuidV1 } from 'uuid';
import { Config, Dial, Loader, Log, Common } from 'src/util';
import { IEnv } from './model/Env.interface';
import { Connection } from 'typeorm';
import { Item, IResTheirData } from './model/res.interface';
import moment = require('moment');

@Injectable()
export class AWSService {
    constructor() {
        this.env = Loader.GetENV<IEnv>("./public/AWS/env.json");
    }
    public static Active: boolean = false;
    private static Name: string = "AWSService";
    private env: IEnv;
    private conn: Connection;


    public WriteToFile(data: any) {
        Log.WriteToFile("AWS", data)
    }

    public async Save(...list: Item[]) {
        // console.log('save')
        // console.log(list)
        if (this.conn == null) {
            this.conn = await Dial.GetSQLConn(Config.DB);
            if (this.conn == null) {
                this.WriteToFile("[AWSService]build conn fail")
                return
            }
        }
        var max = list.length;
        for (var i = 0; i < max; i++) {
            let x = list[i];
            let username = x.username.replace('WINBET_','')
        var cmd =
            `CALL NSP_BetData_Insert_AWS(
                "${username}", 
                "${x.orderId}", 
                "${x.stake}", 
                "${x.bet}", 
                "${x.win}", 
                "${x.balanceBefore}", 
                "${x.balanceAfter}", 
                "${x.operationType}", 
                "${x.operationId}",
                "${x.betTime}",
                "${x.cnGameName}",
                "${x.enGameName}",
                "${x.device}",
                "${x.gameId}",
                "${JSON.stringify(x.finalView)}",
                "${x.txnId}",
                "${x.currency}"
            );` ;

        // console.log(cmd);
        this.conn.query(cmd).catch(e => {
            Logger.debug(e, "AWSService")
            this.WriteToFile(e);
            this.WriteToFile(cmd);
        });
        // conn.close();
    }
}

    // 取得 下注資訊
    public async GetTheirBetData( st: string, et: string) {
        //13位時間戳
        const timestamp = new Date().getTime();
        var request = require('request');
        var options = {
            'method': 'POST',
            'url': `${this.env.API_URL}/order/query`,
            'headers': {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "merchantId": this.env.API_SN,
                "currency": "PHP",
                "currentTime": timestamp,
                "sign": Common.MD5(this.env.API_SN + "PHP" + timestamp +
                        Buffer.from(this.env.API_KEY).toString('base64')),
                "language":"Zh_CN",
                "beginTime":st
            })
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
/*
Base64 編碼/解碼
  let encode = Buffer.from("Hello World").toString('base64');
  let decode = Buffer.from("key", 'base64').toString('utf8');
*/