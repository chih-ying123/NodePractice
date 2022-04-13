import * as fs from 'fs';
import { Common } from "src/util";
import { ParResult, Result, Item } from './res.interface'
import * as moment from 'moment';

export class ParBetInfo {
    public static Template_BetInfo: string;

    public static init() {
        ParBetInfo.Template_BetInfo = fs.readFileSync("./src/crown/views/template_Parbetinfo.html", "utf8");
    }

    public static ToHtml(bet: ParResult) {
        var itemList = [];
        let max = bet.parlaynum;
        // console.log('max', max)
        // console.log('bet.sub',bet.parlaysub)
        for (var i = 1; i <= max; i++) {
            let betdata = bet.parlaysub
            // console.log(i, betdata[i])
            let item = {
                league: betdata[i].league,
                betOption: betdata[i].wtype,
                odds: betdata[i].ioratio,
                oddsFormat: betdata[i].oddsFormat,
                status: betdata[i].resultdetail,
                result: betdata[i].result_score,
                away: betdata[i].tname_away,
                home: betdata[i].tname_home,
                score: betdata[i].score,
                resultscore: betdata[i].result_score,
                order: betdata[i].order
            };
            itemList.push(item);
        }
        // console.log(JSON.stringify(itemList));
        var dist = {
            orderTime: bet.adddate,
            items: itemList
        }
        // console.log(dist)
        if (!fs.existsSync("./src/crown/betinfo")) {
            fs.mkdir("./src/crown/betinfo", { recursive: true }, (err) => {
                if (err) throw err;
            });
        }
        let output = Common.renderHtml(ParBetInfo.Template_BetInfo, dist);
        fs.writeFileSync("./src/crown/betinfo/" + bet.id + "_detail" + ".html", output);
        return output;




    }
}