import { Injectable, Logger } from '@nestjs/common';
import * as moment from 'moment';
import { Config, Dial, Loader, Log } from 'src/util';
import { IEnv } from './model/Env.interface';
import { Token, IResponse, ResponseList } from './model/res.interface';
import { Common } from '../util/Common'
import { Connection } from 'typeorm';
@Injectable()
export class IcgService {
    constructor() {
        this.env = Loader.GetENV<IEnv>("./public/icg/env.json");
    }
    public static Active: boolean = false;
    private env: IEnv;
    private conn: Connection;
    public WriteToFile(data: any) {
        Log.WriteToFile("icg", data)
    }
    public async Save(...list: ResponseList[]) {

        if (this.conn == null) {
            this.conn = await Dial.GetSQLConn(Config.DB);
            if (this.conn == null) {
                this.WriteToFile("[ICGService]build conn fail")
                return
            }
        }
        list.forEach(x => {
            let createdAt = moment(x.createdAt).utc().add(8, "h").format(Common.Formatter_Moment_1);
            let updatedAt = moment(x.updatedAt).utc().add(8, "h").format(Common.Formatter_Moment_1);
            // console.log('x', x)
            let cmd = `CALL NSP_BetData_Insert_ICG(
                "${x.id}",
                "${createdAt}",
                "${updatedAt}",
                "${x.player}",
                "${x.playerId}",
                "${x.parent}",
                "${x.parentId}",
                "${x.game}",
                "${x.gameId}",
                "${x.setId}",
                "${x.productId}",
                "${x.currency}",
                "${x.gameType}",
                "${x.status}",
                "${x.win}",
                "${x.bet}",
                "${x.validBet}"
           );`;
            // console.log(cmd)
            this.conn.query(cmd).catch(e => {
                Logger.debug(e, "ICGService")
                this.WriteToFile(e);
                this.WriteToFile(cmd);
            });

        });

    }

     public async GetTheirBetData(pIdx: number, pSize: number, st: number, et: number) {
        let url = `${this.env.API_URI}api/v1/profile/rounds`;
        let tokenResult = await this.GetToken().then(res => {
            let Data = <Token>JSON.parse(res)
            let token = Data.token
            return token
        });
        var request = require('request');
        var options = {
            'method': 'GET',
            'url': url,
            'headers': {
                "Authorization": `Bearer ${tokenResult}`
            },
            qs: {
                start: st,
                end: et,
                page: pIdx,
                pageSize: pSize
            }
        };
        return new Promise<string>((res, rej) => {
            // console.log(options)
            request(options, function (error, response) {
                if (error) {
                    Log.WriteToFile("icg", "IcgService[GetTheirBetData]error")
                    Log.WriteToFile("icg", error);
                    Logger.log(error, "IcgService[GetTheirBetData]");
                    res('');
                }
                else res(response.body);
            });
        })

    }

    public GetToken() {
        let url = `${this.env.API_URI}login`;
        var request = require('request');
        var options = {
            'method': 'POST',
            'url': url,
            'headers': {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            form: {
                "username": this.env.username,
                "password": this.env.password,
            }
        };
        return new Promise<string>((res, rej) => {
            // console.log('gettoken', options)
            request(options, function (error, response) {
                if (error) {
                    Log.WriteToFile("icg", "IcgService[GetTheirBetData]error")
                    Log.WriteToFile("icg", error);
                    Logger.log(error, "IcgService[GetTheirBetData]");
                    res('');
                }
                else res(response.body);
            });

        });
    }
}
