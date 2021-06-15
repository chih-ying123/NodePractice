import * as fs from 'fs';
import { Common } from "src/util";
import { IPlayerBetList } from '../model/res.interface'

export class BetInfo {
    public static Template_BetInfo: string;

    public static init() {
        BetInfo.Template_BetInfo = fs.readFileSync("./src/sbo/views/template_betinfo.html","utf8");
    }

    public static ToHtml(bet: IPlayerBetList) {
        var itemList = [];
        bet.subBet.forEach((value) => {
            let item = {
                match: value.match,
                league: value.league,
                betOption: value.betOption,
                hdp: value.hdp,
                odds: value.odds,
                status: value.status,
                marketType: value.marketType,
                htScore: value.htScore,
                ftScore: value.ftScore
            };
            itemList.push(item);
        });
        //console.log(JSON.stringify(itemList));
        var dist = {
            orderTime: bet.orderTime,
            items: itemList
        }

        //console.log(dist);
        if(!fs.existsSync("./src/sbo/betinfo")) {
            fs.mkdir("./src/sbo/betinfo", { recursive: true }, (err) => {
                if (err) throw err;
            });
        }

        let output = Common.renderHtml(BetInfo.Template_BetInfo,  dist);
        fs.writeFileSync("./src/sbo/betinfo/"+bet.refNo+".html", output);
        return output;
    }
}