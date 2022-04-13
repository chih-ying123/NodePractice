import { Injectable, Logger } from '@nestjs/common';
import { v1 as uuidV1 } from 'uuid';
import { Config, Dial, Loader, Log, Common } from 'src/util';
import { IEnv } from './model/Env.interface';
import { Connection } from 'typeorm';
import { Item, Result, token, ParResult, IResTheirData, IResParData } from './model/res.interface';
import { BetInfo } from './model/BetInfo';
import { ParBetInfo } from './model/ParBetInfo';
import moment = require('moment');

@Injectable()
export class crownService {
    constructor() {
        this.env = Loader.GetENV<IEnv>("./public/crown/env.json");
        BetInfo.init();
        ParBetInfo.init();
    }
    public static Active: boolean = false;
    private static Name: string = "crownService";
    private env: IEnv;
    private conn: Connection;

    public WriteToFile(data: any) {
        Log.WriteToFile("crown", data)
    }
    public async Save(list: Result) {
        // console.log('save')
        if (this.conn == null) {
            this.conn = await Dial.GetSQLConn(Config.DB);
            if (this.conn == null) {
                this.WriteToFile("[crownService]build conn fail")
                return
            }
        }
        let x = list
        var cmd =
            `CALL NSP_BetData_Insert_crown(
                "${x.id}",
                "${x.gtype}", 
                "${x.wtype}",
                "${x.wtypecode}",
                "${x.settle}", 
                "${x.currency}", 
                "${x.wingold}",
                "${x.wingold_d}", 
                "${x.members_vgold}", 
                "${x.vgold}",
                "${x.gold}", 
                "${x.gold_d}", 
                "${x.degold}", 
                "${x.degold_d}",
                "${x.odds}", 
                "${x.handicap}",
                "${x.ioratio}",
                "${x.result}", 
                "${x.resultdetail}",
                "${x.orderdate}", 
                "${x.adddate}",
                "${x.resultdate}",
                "${x.mid}",
                "${x.username}",
                "${x.IP}",
                "${x.cashoutid}", 
                "${x.cashout}",
                "${x.cashout_d}",
                "${null}", 
                "${null}",
                "${null}",
                '${JSON.stringify(x.cashoutdata)}',
                '${BetInfo.ToHtml(x,x.cashoutdata)}'
            );` ;
        // console.log(cmd);
        this.conn.query(cmd).catch(e => {
            Logger.debug(e, "crownService")
            this.WriteToFile(e);
            this.WriteToFile(cmd);
        });
        // conn.close();
    }
    public async SaveParlist(Parlist: ParResult) {
        // console.log('saveParlist')
        if (this.conn == null) {
            this.conn = await Dial.GetSQLConn(Config.DB);
            if (this.conn == null) {
                this.WriteToFile("[crownService]build conn fail")
                return
            }
        }
        let x = Parlist;
        let parlaysub = JSON.stringify(x.parlaysub).replace("'", "''");
        ParBetInfo.ToHtml(x);
        var cmd =
            `CALL NSP_BetData_Insert_crown(
                "${x.id}",
                "${x.gtype}", 
                "${x.wtype}",
                "${x.wtypecode}",
                "${x.settle}", 
                "${x.currency}", 
                "${x.wingold}",
                "${x.wingold_d}", 
                "${x.members_vgold}", 
                "${x.vgold}",
                "${x.gold}", 
                "${x.gold_d}", 
                "${x.degold}", 
                "${x.degold_d}",
                "${x.odds}", 
                "${x.handicap}",
                "${x.ioratio}",
                "${x.result}", 
                "${x.resultdetail}",
                "${x.orderdate}", 
                "${x.adddate}",
                "${x.resultdate}",
                "${x.mid}",
                "${x.username}",
                "${x.IP}",
                "${x.cashoutid}", 
                "${x.cashout}",
                "${x.cashout_d}",
                "${x.parlay}", 
                "${x.parlaynum}",
                '${parlaysub}',
                "${null}",
                '${ParBetInfo.ToHtml(x)}'
            );` ;

        // console.log(cmd);
        this.conn.query(cmd).catch(e => {
            Logger.debug(e, "crownService")
            this.WriteToFile(e);
            this.WriteToFile(cmd);
        });
        // conn.close();
    }
    // 取得 Token
    public GetToken() {

        var request = require('request');
        var timestamp = moment().unix();
        let data = JSON.stringify({
            "username": this.env.API_USER,
            "password": this.env.API_PW,
            "timestamp": timestamp
        })
        let AES = Common.encrypt(data, this.env.API_KEY, null)
        var options = {
            'method': 'POST',
            'url': `${this.env.API_URI}`,
            'headers': { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "Request": AES,
                "Method": "AGLogin",
                "AGID": this.env.AGID
            })
        };
         //console.log(options)
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
    // 取得 下注資訊
    public async GetTheirBetData(pIdx: number, st: string, et: string) {
        let tokenResult = await this.GetToken().then(res => {
            return res
        });
        let Data = Common.decrypt(tokenResult, this.env.API_KEY, null)
        let token = <token>JSON.parse(Data).token
        var request = require('request');
        var timestamp = moment().unix();
        let data = JSON.stringify({
            "method": this.env.API_USER,
            "token": token,
            "dateStart": st,
            "dateEnd": et,
            "settle": "1",
            "page": pIdx,
            "langx": "en-us",
            "timestamp": timestamp
        })
        let AES = Common.encrypt(data, this.env.API_KEY, null)
        var options = {
            'method': 'POST',
            'url': `${this.env.API_URI}`,
            'headers': {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "Request": AES,
                "Method": "ALLWager",
                "AGID": this.env.AGID
            })
        };
        // console.log(options)
        return new Promise<string>((res, rej) => {
            request(options, (error, response) => {
                if (error) {
                    res('');
                    this.WriteToFile(error);
                }
                else res(Common.decrypt(response.body, this.env.API_KEY, null));
            });

        });
    }
}
