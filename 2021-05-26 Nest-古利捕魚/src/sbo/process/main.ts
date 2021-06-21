import moment = require("moment");
import { Common } from "src/util";

export class Main {

    public static Call(start: number) {
        return new Promise<number>(res => {
            console.log("call:"+start);
            // 留意 !! domain 與 port
            var request = require('request');
            var options = {
                'method': 'GET',
                'url': `http://localhost:3000/wrv/sbo/bet-data/CallBySchedule/${start}`,
                'headers': {}
            };
            request(options, (error, response)=>{
                if (error) {
                    console.log(error);
                    res(0);
                } else {
                    res(response.body);
                }
            });
        });
    }

    public static Active : boolean = false ;
    public static async Bootstap() {
        if(Main.Active) return ;
        Main.Active = true ;

        await Main.Call(0);
        console.log("delay 30");
        await Common.Delay(30*60*1000); // 分*秒*1000 ( 30 分鐘刷新一次 )

        Main.Active = false ;
    }
}

setInterval(()=>Main.Bootstap(), 200) ;