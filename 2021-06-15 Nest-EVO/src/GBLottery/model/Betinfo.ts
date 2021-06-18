import * as fs from 'fs';
import { Common } from "src/util";
import { SettleList } from '../model/BetData.interface'

export class BetInfo {
    public static Template_BetInfo: string;
    public static init() {
        BetInfo.Template_BetInfo = fs.readFileSync("./src/GBLottery/views/template_betinfo.html", "utf8");
    }
    public static ToHtml(bet: SettleList) {
        // console.log('APIResponse ToHtml')
        var WinLose = bet.TicketResult;
        var itemList = [];
        bet.KenoList.forEach(e => {
            let item = {
                id: bet.SettleID,
                odds: bet.InitBetRate / 100, //基數一百
                status: Status(WinLose),
                OddsType: OddType(e.SrcCode),
                PlayType: PlayType(e.OptCode)
            };
            itemList.push(item);
        });
        var dist = {

            items: itemList,
            bettime: bet.BetDT
        }
        function Status(Value) {
            var dict = {
                "0": "Lose", "1": "Win", "2": "Draw", "4": "Cancel", "5": "Cash out", "R": "Rollback"
            };
            return dict[Value];
        }
        function OddType(Value) {
            var dict = {
                "00001": "Beijing KENO",
                "00002": "Oregon KENO",
                "00003": "Slovakia KENO",
                "00004": "Canada West KENO",
                "00005": "Canada BC KENO",
                "00007": "Malta KENO",
                "00020": "Speed KENO",
                "00021": "Quick KENO",
                "00022": "Australia KENO",
                "00032": "Super KENO",
                "00056": "Vietnam KENO"
            };
            return dict[Value];
        }
        function PlayType(Value) {
            var dict = {
                "001": "(PB) Bet",
                "002": "(PB) Bet Against",
                "003": "(PB) Hit All",
                "005": "(U/D) Up",
                "006": "(U/D) Tie",
                "007": "(U/D) Down",
                "008": "(B/S) Big",
                "009": "(B/S) Tie",
                "010": "(B/S) Small",
                "011": "(O/E) Odd",
                "012": "(O/E) Even",
                "013": "(B/S&O/E Parlay) S / O",
                "014": "(B/S&O/E Parlay) B / O",
                "015": "(B/S&O/E Parlay) B / E",
                "016": "(B/S&O/E Parlay) S / E",
                "017": "(O/T/E) Odds",
                "018": "(O/T/E) Tie",
                "019": "(O/T/E) Evens",
                "020": "(5E) Gold",
                "021": "(5E) Wood",
                "022": "(5E) Water",
                "023": "(5E) Fire",
                "024": "(5E) Earth",
                "027": "(Bull-Bull) Banker",
                "028": "(Bull-Bull) Player",
                "029": "(Bull-Bull) Tie"
            };
            return dict[Value];
        }

        // console.log('betinfo', itemList);
        if (!fs.existsSync("./src/GBLottery/betinfo")) {
            fs.mkdir("./src/GBLottery/betinfo", { recursive: true }, (err) => {
                if (err) throw err;
            });
        }
        if (bet.Wintype == "2") {
            let output = Common.renderHtml(BetInfo.Template_BetInfo, dist);
            fs.writeFileSync("./src/GBLottery/betinfo/" + bet.SettleID + "_detail.html", output);
            return output;
        } else {
            let output = Common.renderHtml(BetInfo.Template_BetInfo, dist);
            fs.writeFileSync("./src/GBLottery/betinfo/" + bet.SettleID + ".html", output);
            return output;
        }

    };
}