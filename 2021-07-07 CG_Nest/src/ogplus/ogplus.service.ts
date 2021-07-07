import { Injectable } from '@nestjs/common';

import { Config, Dial, Loader } from 'src/util';
import { IEnv } from './model/Env.interface';
import * as request from 'request';
import { IBetData } from './model/BetData.interface';
import * as fs from 'fs'

@Injectable()
export class OgplusService {
    constructor() {
        this.env = Loader.GetENV<IEnv>("./public/ogplus/env.json");
    }

    private env: IEnv;

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
            let handicap = data.handicap == null ? '' : data.handicap;
            let game_information = JSON.stringify(data.game_information);
            let membername = data.membername.replace(/^yajp_/, '');

            let cmd = `CALL NSP_BetData_OGPlus_Insert(
                      ${data.id}                   
                    , '${membername}'
                    , '${data.gamename}'
                    , '${data.bettingcode}'
                    , '${data.bettingdate}'
                    , '${data.gameid}'            
                    , '${data.roundno}'           
                    , '${game_information}' 
                    , '${data.result}'            
                    , '${data.bet}'
                    , '${data.winloseresult}'
                    , ${data.bettingamount}
                    , ${data.validbet}
                    , ${data.winloseamount}
                    , ${data.balance}
                    , '${data.currency}'
                    , '${handicap}'          
                    , '${data.status}'
                    , '${data.gamecategory}'     
                    , '${data.settledate}'
                    , '${data.remark}'
                    , '${data.vendor_id}'

            );`;

            console.log(cmd);

            fs.appendFile('sqlError.sql', cmd, 'utf8', err => { });
            await conn.query(cmd).catch(e => console.log(e));

        }
        conn.close();
    }

    public GetBetData(start: string, end: string) {

        let url = `${this.env.API_Data}/transaction`;
        console.log(url, start, end);

        var options = {
            'method': 'POST',
            'url': url,
            'headers': {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            formData: {
                'Operator': this.env.Operator,
                'Key': this.env.Key,
                'SDate': start,
                'EDate': end,
                'Provider': this.env.Provider
            }
        };

        return new Promise<string>((resolve, reject) => {
            request(options, function (error, response, body) {
                if (error) {
                    return resolve('');
                }
                resolve(body);
            });
        });
    }

    public GetToken() {

        let url = `${this.env.APIBase}/token`;
        console.log(url);

        let options = {
            'method': 'GET',
            'url': url,
            'headers': {
                "X-Operator": this.env.Operator
                , "X-Key": this.env.Key
            }
        };

        return new Promise<string>(resolve => {
            request(options, function (error, response) {
                if (error) {
                    return resolve('');
                }
                resolve(response.body);
            });
        });
    }
}
