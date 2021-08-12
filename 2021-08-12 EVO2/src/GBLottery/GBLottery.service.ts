import { Injectable, Body, Query, Logger } from '@nestjs/common';
import { Config, Dial, Loader, Log } from 'src/util';
import { IEnv } from './model/Env.interface';
import { APIResponse, SettleList } from './model/BetData.interface';
import { BetInfo } from './model/BetInfo';
import * as fs from 'fs'


@Injectable()
export class GBLotteryService {
    constructor() {
        this.env = Loader.GetENV<IEnv>("./public/GBLottery/env.json");
        BetInfo.init();
    }
    public static Active: boolean = false;
    private env: IEnv;

    // WriteToFile 加入 log 檔寫入
    public WriteToFile(data: any) {
        Log.WriteToFile("GBLottery", data);
    }


    public async SaveDataIntoDB(betDatas: SettleList[]) {
        // console.log('save info to DB')
        let conn = null;
        try {
            conn = await Dial.GetSQLConn(Config.DB);
        }
        catch (err) {
            Logger.error(err)
            this.WriteToFile(err);
        }

        for (let Data of betDatas) {

            let subBet = JSON.stringify(Data.KenoList).replace("'", "''");
            var cmd = `CALL NSP_BetData_Insert_GBLottery(
             ${Data.SettleID}, 
             ${Data.BetID},
             "${Data.BetGrpNO}",
             "${Data.TPCode}",
             ${Data.GBSN},
             "${Data.MemberID}",
             "${Data.CurCode}",
             "${Data.BetDT}",
             "${Data.BetType}",
             ${Data.BetTypeParam1},
             ${Data.BetTypeParam2},
             "${Data.Wintype}",
             ${Data.HxMGUID},
             ${Data.InitBetAmt / 100},
             ${Data.RealBetAmt / 100},
             ${Data.HoldingAmt / 100},
             ${Data.InitBetRate / 100},
             ${Data.RealBetRate / 100},
             ${Data.PreWinAmt / 100},
             "${Data.BetResult}",
             ${Data.WLAmt / 100},
             ${Data.RefundAmt / 100},
             ${Data.TicketBetAmt / 100},
             "${Data.TicketResult}",
             ${Data.TicketWLAmt / 100},
             "${Data.SettleDT}",
             '${subBet}',
            '${BetInfo.ToHtml(Data)}'
             );`;


            // console.log(cmd);
            //await conn.query(cmd).catch(e => fs.appendFile('sqlError.sql', cmd, 'utf8', err => { }));

            await conn.query(cmd).catch(e => {
                Logger.debug(e, "GBLotteryService")
                this.WriteToFile(e);
                this.WriteToFile(cmd);
            });

        }

        conn.close();
    }

    //查詢一般注單
    public GetTheirBetData(ID: string) {

        // @see https://github.com/request/request#requestoptions-callback

        return new Promise<string>((res, rej) => {
            var request = require('request');
            var options = {
                'method': 'POST',
                'url': `${this.env.API_URI}`,
                'headers': {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(
                    {
                        GB: {
                            'Method': "GetGamingSettle",
                            'TPCode': `${this.env.TPCode}`,
                            "AuthKey": `${this.env.API_KEY}`,
                            "Params": { StartSettleID: ID, EndSettleID: '-1' }
                        }
                    })
            };
            // console.log(options)
            request(options, function (error, response) {
                if (error) {
                    this.WriteToFile("GBLotteryService[GetTheirBetData]error")
                    this.WriteToFile(error);
                    Logger.log(error, "GBLotteryService[GetTheirBetData]");
                    res('');
                }
                else res(response.body);
            });
        });
    }
}
