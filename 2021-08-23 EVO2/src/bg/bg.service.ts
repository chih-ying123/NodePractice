import { Injectable, Logger } from '@nestjs/common';
import { v1 as uuidV1 } from 'uuid';
import { Config, Dial, Loader, Log, Common } from 'src/util';
import { IEnv } from './model/Env.interface';
import { Connection } from 'typeorm';
import { Item } from './model/res.interface';
import moment = require('moment');

@Injectable()
export class BgService {
    constructor() {
        this.env = Loader.GetENV<IEnv>("./public/bg/env.json");
    }
    public static Active: boolean = false;
    private static Name: string = "BgService";
    private env: IEnv;
    private conn : Connection ;

    private status= {
        2:"Win",
        3:"Draw",
        4:"Lose",
        5:"Cancel",
        6:"Expired",
        7:"System Cancel"
    }

    public WriteToFile(data: any) {
        Log.WriteToFile("bg", data)
    }

    public async Save(...list: Item[]) {

        if ( this.conn == null ){
            this.conn = await Dial.GetSQLConn(Config.DB);
            if (this.conn == null){
                this.WriteToFile("[BgService]build conn fail")
                return
            }
        }

        var max = list.length;
        for (var i = 0; i < max; i++) {
            let x = list[i];

            let betinfo = `
            <div>Bet:${x.bAmount}</div>
            <div>Round result:${x.playNameEn}</div>
            <div>Player results:${this.status[x.orderStatus]}</div>
            <div>Win or lose:${x.payment}</div>
            ` ;

            let cmd = `CALL NSP_BetData_Insert_BG(
                "${x.tableId}",
                "${x.sn}",
                ${x.uid},
                "${x.loginId}",
                ${x.moduleId},
                "${x.moduleName}",
                "${x.gameId}",
                "${x.gameName}",
                "${x.gameNameEn}",
                ${x.orderStatus},
                ${x.bAmount},
                ${x.aAmount},
                ${x.orderFrom},
                "${moment(x.orderTime).format("YYYY-MM-DD HH:mm:ss")}",
                "${moment(x.lastUpdateTime).format("YYYY-MM-DD HH:mm:ss")}",
                "${x.fromIp}",
                "${x.issueId}",
                "${x.playId}",
                "${x.playName}",
                "${x.playNameEn}",
                ${x.validBet},
                ${x.validAmount},
                ${x.payment},
                "${x.betContent}",
                "${x.noComm}",
                "${betinfo}",
                ${x.orderId});` ;

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
                // 'timeout': 3000,
                'headers': {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "id": id,
                    "method": "open.order.query",
                    "jsonrpc": "2.0",
                    "params": {
                        "random": id,
                        "sign": Common.MD5([id, this.env.API_SN, this.env.API_SECRET_KEY].join("")),
                        "sn": this.env.API_SN,
                        "pageIndex": pIdx,
                        "pageSize": pSize,
                        "startTime": st,
                        "endTime": et
                    }
                })
            };

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
