import moment = require("moment");
import { Common } from "src/util";

export class Main {

    public static Call(start: string, end: string) {
        return new Promise<boolean>(res => {

            // 留意 !! domain 與 port
            var request = require('request');
            var options = {
                'method': 'GET',
                'timeout': 5000, // ms
                'url': `http://localhost:3000/wrt/rtg/bet-data/CallBySchedule/${start}/${end}`,
                'headers': {}
            };
            request(options, (error, response)=>{
                if (error) {
                    console.log(error);
                    res(false);
                } else res(response.body);
            });
        });
    }

    public static Active: boolean = false;
    public static async Bootstap() {
        if (Main.Active) return;
        Main.Active = true;

        let date = moment().format(Common.Formatter_Moment_0);
        let yesterday = moment().add(-1, "days").format(Common.Formatter_Moment_0);

        console.log(`Start, ${date}`);

        let list = Common.dateSplitByMin(yesterday, 120).concat(Common.dateSplitByMin(date, 120));
        let max = list.length;

        for (var i = 0; i < max; i++) {
            var item = list[i];
            var res = await Main.Call(item.start, item.end);
            await Common.Delay(1000); // 合作廠商是否有時間沿遲
        }
        console.log(`End, ${yesterday}`);

        console.log(`pause`);
        await Common.Delay(1 * 60 * 1000); // 分*秒*1000 ( 1 分鐘刷新一次 )
        Main.Active = false;
        console.log(`next`);
    }
}

var t = setInterval(() => Main.Bootstap(), 300);
t.unref();

setImmediate(() => t.ref());