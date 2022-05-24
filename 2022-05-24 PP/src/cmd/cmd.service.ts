import { Injectable, Body, Query, Logger } from '@nestjs/common';
import { Config, Dial, Loader, Log } from 'src/util';
import { IEnv } from './model/Env.interface';
import { IBetData } from './model/BetData.interface';
import { APIResponse } from './model/BetData.interface';
import { ParBetData, ParAPIResponse } from './model/ParBetData.interface';
import { ParBetInfo } from './model/ParBetInfo';
import { BetInfo } from './model/BetInfo';
import * as fs from 'fs'


@Injectable()
export class CmdService {
    constructor() {
        this.env = Loader.GetENV<IEnv>("./public/cmd/env.json");
        ParBetInfo.init();
        BetInfo.init();
    }
    public static Active: boolean = false;
    private env: IEnv;

    // WriteToFile 加入 log 檔寫入
    public WriteToFile(data:any){
        Log.WriteToFile("cmd", data) ;
    }
    

    public async SaveDataIntoDB(betDatas: APIResponse) {
        console.log('save info to DB')
        let conn = null;
        try {
            conn = await Dial.GetSQLConn(Config.DB);
        }
        catch (err) {
            Logger.error(err)
            this.WriteToFile(err) ;
        }

        for (let Data of betDatas.Data) {

            let subBet = JSON.stringify(Data).replace("'", "''");
            var cmd = `CALL NSP_BetData_Insert_CMD(
            "${Data.Id}", 
            "${Data.SourceName}",
            "${Data.ReferenceNo}",
            "${Data.SocTransId}",
            "${Data.BetAmount}",
            "${Data.Outstanding}",
            "${Data.WinAmount}",
            "${Data.Currency}",
            "${Data.ExchangeRate}",
            "${Data.WinLoseStatus}",
            "${Data.DangerStatus}",
            "${Data.RejectReason}",
            "${Data.SportType}",
            "${Data.TransType}",
            "${Data.TransDate}",
            "${Data.WorkingDate}",
            "${Data.MatchDate}",
            "${Data.StatusChange}",
            "${Data.StateUpdateTs}",
            '${subBet}',
            NULL,
            "${BetInfo.ToHtml(Data)}"
            );`;
            
            
            console.log(cmd);
            //await conn.query(cmd).catch(e => fs.appendFile('sqlError.sql', cmd, 'utf8', err => { }));

            await conn.query(cmd).catch(e => {
                Logger.debug(e, "CMDService")
                this.WriteToFile(e);
                this.WriteToFile(cmd);
			});

        }

        conn.close();
    }
    public async SaveParDataIntoDB(sid: string, ParbetDatas: ParAPIResponse) {
        console.log('save subbetinfo to DB')

        let conn = null;
        try {
            conn = await Dial.GetSQLConn(Config.DB);
        }
        catch (err) {
            Logger.error(err)
            this.WriteToFile(err) ;
        }


        if (conn == null) throw new Error("no sql conn !!");

        let subBet = JSON.stringify(ParbetDatas).replace("'", "''");

        var cmd = `call NSP_BetData_Insert_CMD_subBetData(
        "${sid}", 
        '${subBet}',
        "${ParBetInfo.ToHtml(ParbetDatas)}"
        );`;

        //await conn.query(cmd).catch(e => fs.appendFile('sqlError.sql', cmd, 'utf8', err => { }));
        //console.log(cmd);

        await conn.query(cmd).catch(e => {
            Logger.debug(e, "CMDService")
            this.WriteToFile(e);
            this.WriteToFile(cmd);
        });

        conn.close();
    }
    //查詢一般注單
    public GetTheirBetData(ID: string) {

        // @see https://github.com/request/request#requestoptions-callback

        return new Promise<string>((res, rej) => {
            var request = require('request');
            var options = {
                'method': 'POST',
                'url': `${this.env.API_URI}/SportsApi.aspx`,
                'headers': {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'Method': "betrecord",
                    "PartnerKey": `${this.env.API_SECRET_KEY}`,
                    "Version": ID
                })
            };
            // console.log(options)
            request(options, function (error, response) {
                if (error) {
                    this.WriteToFile("CMDService[GetTheirBetData]error")
                    this.WriteToFile(error) ;
                    Logger.log(error, "CMDService[GetTheirBetData]");
                    res('');
                }
                else res(response.body);
            });
        });
    }
    //查詢細單
    public GetPARBetData(ID: string) {

        return new Promise<string>((res, rej) => {
            var request = require('request');
            var options = {
                'method': 'POST',
                'url': `${this.env.API_URI}/SportsApi.aspx`,
                'headers': {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'Method': "parlaybetrecord",
                    "PartnerKey": `${this.env.API_SECRET_KEY}`,
                    "SocTransID": ID
                })
            };
            // console.log(options)
            request(options, function (error, response) {
                if (error) {
                    this.WriteToFile("CMDService[GetPARBetData]error")
                    this.WriteToFile(error) ;
                    Logger.log(error, "CMDService[GetPARBetData]");
                    res('');
                }
                else res(response.body);
            });

        });

    }
    //查询语言信息
    public GetInfoBetData(ID: string, Type: string) {

        return new Promise<string>((res, rej) => {
            var request = require('request');
            var options = {
                'method': 'POST',
                'url': `${this.env.API_URI}/SportsApi.aspx`,
                'headers': {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'Method': "languageinfo",
                    "PartnerKey": `${this.env.API_SECRET_KEY}`,
                    "Type": Type,
                    "ID": ID
                })
            };
            // console.log(options)
            request(options, function (error, response) {
                if (error) {
                    this.WriteToFile("CMDService[GetInfoBetData]error")
                    this.WriteToFile(error) ;
                    Logger.log(error, "CMDService[GetInfoBetData]");
                    res('');
                }
                else res(response.body);
            });

        });

    }
    //查询球赛结果
    public GetSportBetData(ID: string) {

        return new Promise<string>((res, rej) => {
            var request = require('request');
            var options = {
                'method': 'POST',
                'url': `${this.env.API_URI}/SportsApi.aspx`,
                'headers': {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'Method': "matchresult",
                    "PartnerKey": `${this.env.API_SECRET_KEY}`,
                    "SocTransID": ID
                })
            };
            // console.log(options)
            request(options, function (error, response) {
                if (error) {
                    this.WriteToFile("CMDService[GetSportBetData]error")
                    this.WriteToFile(error) ;
                    Logger.log(error, "CMDService[GetSportBetData]");
                    res('');
                }
                else res(response.body);
            });

        });

    }
}
