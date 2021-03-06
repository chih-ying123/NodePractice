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
        /*轉換字串為數字，可以是整數也可以是小數，但有不是數字的字串時會得到NaN*/
        function Cashout() {
            //兌現新注單cashoutid會關聯原始單
            if (bet.cashoutid != '0') {
                let e = OriginalBetData;
                //新單號不會有Cashoutid
                // console.log('兌現新單號:', bet['id'], '兌現[原]單號:', e['id'], '兌現金額(cashout):', e['cashout'], '下注金額(gold):', e['gold'])
                //兌現金額等於下注金額為全部兌現
                if (Number(e.cashout) == Number(e.gold)) {
                    // console.log('全部兌現')
                    var dict = "Cash out all"
                    return dict
                }
                //兌現金額小於下注金額為部分兌現
                if (Number(e.cashout) < Number(e.gold)) {
                    // console.log('部分兌現')
                    var dict = "Partly cashed out"
                    return dict
                };
             // 判斷兌現原始單 如果兌現金額不為0  
            }else if (Number(bet.cashout) != 0) {
                let e = OriginalBetData;
                // console.log('兌現[原]單號:', bet['id'], '兌現金額(cashout):', bet['cashout'], '下注金額(gold):', bet['gold'])
                //兌現金額等於下注金額為全部兌現
                if (Number(bet.cashout) == Number(bet.gold)) {
                    // console.log('全部兌現')
                    var dict = "Cash out all"
                    return dict
                }
                //兌現金額小於下注金額為部分兌現
                if (Number(bet.cashout) < Number(bet.gold)) {
                    // console.log('部分兌現')
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