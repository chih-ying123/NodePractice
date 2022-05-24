import * as fs from 'fs';
import { Common } from "src/util";
import { APIResponse, IBetData } from '../model/BetData.interface'
import { query } from 'express';

export class BetInfo {
    public static Template_BetInfo: string;
    public static init() {
        BetInfo.Template_BetInfo = fs.readFileSync("./src/cmd/views/template_betinfo.html", "utf8");
    }
    public static ToHtml(bet: IBetData) {
        console.log('APIResponse ToHtml')
        var WinLose = bet.WinLoseStatus;
        var Odds = bet.OddsType;
        var Play = bet.TransType;
        var itemList = [];
        let item = {
            HomeTeam: bet.HomeTeamName, //主
            AwayTeam: bet.AwayTeamName, //客
            LeagueName: bet.LeagueName, //聯盟
            hdp: bet.Hdp,//让球数
            odds: bet.Odds,//投注时的赔率
            status: Status(WinLose),
            OddsType: OddsType(Odds),
            PlayType: PlayType(Play),
            ftHomeScore: bet.HomeScore,
            ftAwayScore: bet.AwayScore,
            htHomeScore: bet.HTHomeScore,
            htAwayScore: bet.HTAwayScore
        };
        itemList.push(item);
        var dist = {
            items: itemList
        }
        function Status(Value) {
            var dict = {
                WA: "Win All",
                WH: "Win Half",
                LA: "Lose All",
                LH: "Lose Half",
                D: "Draw",
                P: "Pending"
            };
            return dict[Value];
        }
        function OddsType(Value) {
            var dict = {
                MY: "马来盘",
                ID: "印度尼西亚盘",
                HK: "香港盘",
                DE: "欧洲盘",
                MR: "缅甸盘"
            };
            return dict[Value];
        }
        function PlayType(Value) {
            let dict = {
                "1": "下注 1",
                "2": "下注 2",
                "CS": "波胆",
                "FLG": "最先/最后进球",
                "HDP": "让球",
                "HFT": "半场/全场",
                "OE": "单/双",
                "OU": "大/小",
                "OUT": "优胜冠军",
                "PAR": "混合过关",
                "TG": "总进球",
                "X": "下注 X",
                "1X": "双重机会(DC) 下注 1X",
                "12": "双重机会(DC) 下注 12",
                "X2": "双重机会(DC) 下注 X2"
            }
            return dict[Value];
        }
        console.log('一般單', itemList);
        if (!fs.existsSync("./src/cmd/betinfo")) {
            fs.mkdir("./src/cmd/betinfo", { recursive: true }, (err) => {
                if (err) throw err;
            });
        }
        let output = Common.renderHtml(BetInfo.Template_BetInfo, dist);
        fs.writeFileSync("./src/cmd/betinfo/" + bet.ReferenceNo + ".html", output);
        return output;
    };
}