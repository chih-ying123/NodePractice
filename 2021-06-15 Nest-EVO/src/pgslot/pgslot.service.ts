import { Injectable } from '@nestjs/common';

import { Config, Dial, Loader } from 'src/util';
import { IEnv } from './model/Env.interface';

@Injectable()
export class PgslotService {
    constructor() {
        this.env = Loader.GetENV<IEnv>("./public/pgslot/env.json");
    }
    public static Active: boolean = false;
    private env: IEnv;

    public async Save(...list: any[]) {
        var conn = await Dial.GetSQLConn(Config.DB);
        if (conn == null) throw new Error("no sql conn !!") ;
        conn.close();
    }

    public GetTheirBetData() {

        // @see https://github.com/request/request#requestoptions-callback

        return new Promise<string>((res,rej) => {
            var request = require('request');
            var options = {
                'timeout':1,
                'method': 'GET',
                'url': '',
                'headers': {}
            };

            request(options, function (error, response) {
                if (error) {
                    res('');
                    this.WriteToFile(error);
                }
                else res(response.body);
            });
            
        });

    }
}
