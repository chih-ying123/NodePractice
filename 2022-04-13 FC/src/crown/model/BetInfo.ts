import * as fs from 'fs';
import { Common } from "src/util";
import { Result, OrginalCashoutData } from '../model/res.interface'

export class BetInfo {
    public static Template_BetInfo: string;

    public static init() {
        BetInfo.Template_BetInfo = fs.readFileSync("./src/crown/views/template_betinfo.html", "utf8");
    }
    public static ToHtml(bet: Result, OriginalBetData: OrginalCashoutData) {
        var itemList = [];
        let item = {
            league: bet.league,
            betOption: bet.wtype,
            hdp: bet.handicap,
            odds: bet.ioratio,
            oddsFormat: bet.oddsFormat,
            status: bet.resultdetail,
            result: bet.result_score,
            away: bet.tname_away,
            home: bet.tname_home,
            score: bet.score,
            resultscore: bet.result_score,
            order: bet.order,
            cashout: Cashout()
        };
        itemList.push(item);
        /*Number()
        /*锣传﹃计琌俱计琌计Τぃ琌计﹃穦眔NaN*/
        function Cashout() {
            //瞷穝猔虫cashoutid穦闽羛﹍虫
            if (bet.cashoutid != '0') {
                let e = OriginalBetData;
                //穝虫腹ぃ穦ΤCashoutid
                // console.log('瞷穝虫腹:', bet['id'], '瞷[]虫腹:', e['id'], '瞷肂(cashout):', e['cashout'], '猔肂(gold):', e['gold'])
                //瞷肂单猔肂场瞷
                if (Number(e.cashout) == Number(e.gold)) {
                    // console.log('场瞷')
                    var dict = "Cash out all"
                    return dict
                }
                //瞷肂猔肂场だ瞷
                if (Number(e.cashout) < Number(e.gold)) {
                    // console.log('场だ瞷')
                    var dict = "Partly cashed out"
                    return dict
                };
             // 耞瞷﹍虫 狦瞷肂ぃ0  
            }else if (Number(bet.cashout) != 0) {
                let e = OriginalBetData;
                // console.log('瞷[]虫腹:', bet['id'], '瞷肂(cashout):', bet['cashout'], '猔肂(gold):', bet['gold'])
                //瞷肂单猔肂场瞷
                if (Number(bet.cashout) == Number(bet.gold)) {
                    // console.log('场瞷')
                    var dict = "Cash out all"
                    return dict
                }
                //瞷肂猔肂场だ瞷
                if (Number(bet.cashout) < Number(bet.gold)) {
                    // console.log('场だ瞷')
                    var dict = "Partly cashed out"
                    return dict
                };
            } else {
                return dict = ''
            }
        }
        // console.log(JSON.stringify(itemList));
        var dist = {
            orderTime: bet.adddate,
            items: itemList
        }
        // console.log('dist', dist)
        if (!fs.existsSync("./src/crown/betinfo")) {
            fs.mkdir("./src/crown/betinfo", { recursive: true }, (err) => {
                if (err) throw err;
            });
        }
        let output = Common.renderHtml(BetInfo.Template_BetInfo, dist);
        fs.writeFileSync("./src/crown/betinfo/" + bet.id + ".html", output);
        return output;

    }
}