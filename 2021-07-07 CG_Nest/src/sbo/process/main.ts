import moment = require("moment");
import { Common } from "src/util";

export class Main {

    public static Call(start: string, end: string) {
        return new Promise<number>(res => {
            console.log("call "+start+" to "+end);
            // 留意 !! domain 與 port
            var request = require('request');
            var options = {
                'method': 'GET',
                'timeout': 5000, // ms
                'url': `http://localhost:3000/wrc/sbo/bet-data/CallBySchedule/${start}/${end}`,
                'headers': {}
            };
            request(options, function (error, response) {
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

        let startDate = moment().add(-1, "days").format("YYYY-MM-DDTHH:MM:SS");
        let endDate = moment().format("YYYY-MM-DDTHH:MM:SS");

        console.log(`Start, ${startDate}`);
        console.log(`End, ${endDate}`);

        var res = await Main.Call(startDate, endDate);

        console.log("delay 30");
        await Common.Delay(30*60*1000); // 分*秒*1000 ( 30 分鐘刷新一次 )

        Main.Active = false ;
    }
}

setInterval(()=>Main.Bootstap(), 200) ;