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
        /*�ഫ�r�ꬰ�Ʀr�A�i�H�O��Ƥ]�i�H�O�p�ơA�������O�Ʀr���r��ɷ|�o��NaN*/
        function Cashout() {
            //�I�{�s�`��cashoutid�|���p��l��
            if (bet.cashoutid != '0') {
                let e = OriginalBetData;
                //�s�渹���|��Cashoutid
                // console.log('�I�{�s�渹:', bet['id'], '�I�{[��]�渹:', e['id'], '�I�{���B(cashout):', e['cashout'], '�U�`���B(gold):', e['gold'])
                //�I�{���B����U�`���B�������I�{
                if (Number(e.cashout) == Number(e.gold)) {
                    // console.log('�����I�{')
                    var dict = "Cash out all"
                    return dict
                }
                //�I�{���B�p��U�`���B�������I�{
                if (Number(e.cashout) < Number(e.gold)) {
                    // console.log('�����I�{')
                    var dict = "Partly cashed out"
                    return dict
                };
             // �P�_�I�{��l�� �p�G�I�{���B����0  
            }else if (Number(bet.cashout) != 0) {
                let e = OriginalBetData;
                // console.log('�I�{[��]�渹:', bet['id'], '�I�{���B(cashout):', bet['cashout'], '�U�`���B(gold):', bet['gold'])
                //�I�{���B����U�`���B�������I�{
                if (Number(bet.cashout) == Number(bet.gold)) {
                    // console.log('�����I�{')
                    var dict = "Cash out all"
                    return dict
                }
                //�I�{���B�p��U�`���B�������I�{
                if (Number(bet.cashout) < Number(bet.gold)) {
                    // console.log('�����I�{')
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