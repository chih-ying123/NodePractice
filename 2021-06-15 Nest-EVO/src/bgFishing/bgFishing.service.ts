import { Body, Injectable, Logger } from '@nestjs/common';
import { v1 as uuidV1 } from 'uuid';
import { Config, Dial, Loader, Log, Common } from 'src/util';
import { IEnv } from './model/Env.interface';
import { Connection } from 'typeorm';
import { Item } from './model/res.interface';
import moment = require('moment');

@Injectable()
export class BgFishingService {
    constructor() {
        this.env = Loader.GetENV<IEnv>("./public/BgFishing/env.json");
    }
    public static Active: boolean = false;
    private static Name: string = "BgFishingService";
    private env: IEnv;
    private conn: Connection;

    private status = {
        2: "赢",
        3: "和",
        4: "輸",
        5: "取消",
        6: "過期",
        7: "系統消取"
    }

    public WriteToFile(data: any) {
        Log.WriteToFile("bgFishing", data)
    }

    public async Save(...list: Item[]) {

        if (this.conn == null) {
            this.conn = await Dial.GetSQLConn(Config.DB);
            if (this.conn == null) {
                this.WriteToFile("[BgFishingService]build conn fail")
                return
            }
        }

        var max = list.length;
        for (var i = 0; i < max; i++) {
            let x = list[i];

            let cmd = `CALL NSP_BetData_Insert_BG_Fishing(
                "${x.sn}",
                "${x.userId}",
                "${x.loginId}",
                "${x.issueId}",
                "${x.betId}",
                "${x.gameBalance}",
                "${x.fireCount}",
                "${x.betAmount}",
                "${x.validAmount}",
                "${x.calcAmount}",
                "${x.payout}",
                "${x.orderTime}",
                "${x.orderFrom}",
                "${x.jackpot}",
                "${x.extend}",
                "${x.jackpotType}",
                "${x.gameType}",
                "${x.orderTimeBj}"
                );` ;

            await this.conn.query(cmd).catch(e => {
                Logger.debug(e, "BgService")
                this.WriteToFile(e);
                this.WriteToFile(cmd);
            });
        }

        // conn.close();
    }

    // 取得 下注資訊
    public GetTheirBetData(pIdx: number, pSize: number, st: string, et: string) {
        // @see https://github.com/request/request#requestoptions-callback

        var id = uuidV1()

        return new Promise<string>((res, rej) => {
            var request = require('request');
            var options = {
                'method': 'POST',
                'url': this.env.API_URI,
                'headers': {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "id": id,
                    "method": "open.order.bg.query",
                    "jsonrpc": "2.0",
                    "params": {
                        "random": id,
                        "sign": Common.MD5([id, this.env.API_SN, this.env.API_SECRET_KEY].join("")),
                        "sn": this.env.API_SN,
                        "pageIndex": pIdx,
                        "pageSize": pSize,
                        "timeZone": 1, //时区类型 1:北京时间; 2:美东时间(默认)
                        "gameType": 1, //当指定gameType=1时，将同时返回BG 捕鱼大师和西游捕鱼的注单记录
                        "startTime": st,
                        "endTime": et
                    }
                })
            };
            // console.log(options)
            // console.debug(options.body)

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
