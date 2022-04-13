import { Injectable, Logger } from '@nestjs/common';
import { v1 as uuidV1 } from 'uuid';
import { Config, Dial, Loader, Log, Common } from 'src/util';
import { IEnv } from './model/Env.interface';
import { Connection } from 'typeorm';
import {  Result } from './model/res.interface';
import moment = require('moment');

@Injectable()
export class FTGService {
    constructor() {
        this.env = Loader.GetENV<IEnv>("./public/FTG/env.json");
    }
    public static Active: boolean = false;
    private static Name: string = "FTGService";
    private env: IEnv;
    private conn: Connection;


    public WriteToFile(data: any) {
        Log.WriteToFile("FTG", data)
    }

    public async Save(...list: Result[]) {
        console.log('save')
        if (this.conn == null) {
            this.conn = await Dial.GetSQLConn(Config.DB);
            if (this.conn == null) {
                this.WriteToFile("[FTGService]build conn fail")
                return
            }
        }
        var max = list.length;
        for (var i = 0; i < max; i++) {
        let x = list[i];
            var cmd = `CALL NSP_BetData_Insert_FTG(
                 ${x.id},
                "${moment(x.bet_at).utc().add(8, "h").format("YYYY-MM-DD HH:mm:ss")}",
                "${moment(x.modified_at).utc().add(8, "h").format("YYYY-MM-DD HH:mm:ss")}",
                "${moment(x.payoff_at).utc().add(8, "h").format("YYYY-MM-DD HH:mm:ss")}",
                "${x.round_date}",
                "${x.lobby_id}",
                 ${x.game_id},
                 ${x.game_group_id},
                 ${x.device},
                "${x.device_version}",
                 ${x.bet_amount},
                 ${x.profit},
                 ${x.payoff},
                "${x.currency}",
                "${x.username}",
                "${x.result}",
                 ${x.commission},
                 ${x.commissionable}
            
            );` ;
       
        // console.log(cmd);
        this.conn.query(cmd).catch(e => {
            Logger.debug(e, "FTGService")
            this.WriteToFile(e);
            this.WriteToFile(cmd);
        });
        }
        // conn.close();
    }
    
    // 取得 下注資訊
    public  GetTheirBetData(pIdx: number, pSize: number, st: string, et: string) {
        // @see https://github.com/request/request#requestoptions-callback
        let params = {
            lobby_id: 'FTGSLOT',
            date_type: '2',
            begin_at: st,
            end_at: et,
            wagers_type: '1',
            page: pIdx,
            page_size: pSize,
            client_id: this.env.API_ID
        }
        console.log(params);
        const jwt = require('jsonwebtoken');
        const token = jwt.sign(params, this.env.API_KEY);
      
        return new Promise<string>((res, rej) => {
            var request = require('request');
            var options = {
                method: 'GET',
                url: `${this.env.API_URI}/api/wagers/outside/list`,
                qs:
                {
                    lobby_id:'FTGSLOT',
                    date_type:'2',
                    begin_at: st,
                    end_at: et,
                    wagers_type:'1',
                    page: pIdx,
                    page_size: pSize,
                    client_id:this.env.API_ID
                },
                headers:
                {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json'
                }
            };
            console.log(options)

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
