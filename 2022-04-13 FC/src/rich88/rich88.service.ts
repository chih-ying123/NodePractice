import { Body, Injectable, Logger } from '@nestjs/common';
import { Config, Dial, Loader, Log, Common } from 'src/util';
import { IEnv } from './model/Env.interface';
import { Connection } from 'typeorm';
import { Item } from './model/res.interface';
import moment = require('moment');

@Injectable()
export class rich88Service {
    constructor() {
        this.env = Loader.GetENV<IEnv>("./public/rich88/env.json");
    }
    public static Active: boolean = false;
    private static Name: string = "rich88Service";
    private env: IEnv;
    private conn: Connection;

    public WriteToFile(data: any) {
        Log.WriteToFile("rich88", data)
    }
    public async Save(...list: Item[]) {
        console.log('save')
        if (this.conn == null) {
            this.conn = await Dial.GetSQLConn(Config.DB);
            if (this.conn == null) {
                this.WriteToFile("[rich88Service]build conn fail")
                return
            }
        }
        var max = list.length;
        for (var i = 0; i < max; i++) {
            let x = list[i];
            let created_at = moment(x.created_at).utc().add(4, "h").format(Common.Formatter_Moment_1);
            let updated_at = moment(x.updated_at).utc().add(4, "h").format(Common.Formatter_Moment_1);
            let round_start_at = moment(x.round_start_at).utc().add(4, "h").format(Common.Formatter_Moment_1);
            let round_end_at = moment(x.round_end_at).utc().add(4, "h").format(Common.Formatter_Moment_1);
            let cmd = `CALL NSP_BetData_Insert_Rich88(
                        "${x.record_id}",
                        "${created_at}",
                        "${updated_at}",
                        "${x.game_code}",
                        "${x.account}",
                        "${x.bet_status}",
                        ${x.base_bet},
                        ${x.bet},
                        ${x.bet_valid},
                        ${x.profit},
                        ${x.tax},
                        ${x.balance},
                        ${x.bonus},
                        '${x.result}',
                        "${x.round_id}",
                        "${round_start_at}",
                        "${round_end_at}",
                        "${x.currency}",
                        "${x.category}"
                        );` ;
            // console.log(cmd)
           this.conn.query(cmd).catch(e => {
                Logger.debug(e, "Rich88Service")
                this.WriteToFile(e);
                this.WriteToFile(cmd);
            });

        }

        // conn.close();
    }

    // 取得 下注資訊
    public GetTheirBetData(pIdx: number, pSize: number, st: string, et: string) {
        var timestamp = moment().unix();
        return new Promise<string>((res, rej) => {
            var request = require('request');
            var options = {
                method: 'GET',
                url: `${this.env.API_URI}v2/platform/bet_records`,
                qs:
                {
                    from: st,
                    to: et,
                    page: pIdx,
                    size: pSize
                },
                headers:
                {
                    api_key: Common.SHA256([this.env.API_SN, this.env.API_SECRET_KEY, timestamp].join("")),
                    pf_id: this.env.API_SN,
                    timestamp: timestamp
                }
            };
            //console.log(options)
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
