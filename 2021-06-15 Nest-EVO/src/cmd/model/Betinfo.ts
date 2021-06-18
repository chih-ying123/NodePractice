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
                MY: "MY",
                ID: "ID",
                HK: "HK",
                DE: "DE",
                MR: "MR"
            };
            return dict[Value];
        }
        function PlayType(Value) {
            let dict = {
                "1": "Bet 1",
                "2": "Bet 2",
                "CS": "CS",
                "FLG": "FLG",
                "HDP": "HDP",
                "HFT": "HFT",
                "OE": "OE",
                "OU": "OU",
                "OUT": "OUT",
                "PAR": "PAR",
                "TG": "TG",
                "X": "Bet X",
                "1X": "DC Bet 1X",
                "12": "DC Bet 12",
                "X2": "DC Bet X2"
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