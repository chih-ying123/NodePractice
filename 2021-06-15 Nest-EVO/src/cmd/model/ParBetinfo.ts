import * as fs from 'fs';
import { Common } from "src/util";
import { ParAPIResponse } from '../model/PARBetData.interface'
import { query } from 'express';

export class ParBetInfo {
    public static Template_ParBetInfo: string;

    public static init() {
        ParBetInfo.Template_ParBetInfo = fs.readFileSync("./src/cmd/views/template_PARbetinfo.html", "utf8");
    }
    public static ToHtml(bet: ParAPIResponse) {
        var itemList = [];
        bet.Data.forEach((value) => {
            var WinLose = value.ParStatus;
            var Play = value.ParTransType;
            let item = {
                HomeTeam: value.HomeTeamName, //主
                AwayTeam: value.AwayTeamName, //客
                LeagueName: value.LeagueName, //聯盟
                hdp: value.Hdp,//让球数
                odds: value.ParOdds,//投注时的赔率
                status: Status(WinLose),
                PlayType: PlayType(Play),
                htScore: value.HTScore,
                ftScore: value.FTScore
            };
            itemList.push(item);
        });
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
        console.log('混合單', dist);
        if (!fs.existsSync("./src/cmd/betinfo")) {
            fs.mkdir("./src/cmd/betinfo", { recursive: true }, (err) => {
                if (err) throw err;
            });
        }
        let output
        bet.Data.forEach((value) => {
            output = Common.renderHtml(ParBetInfo.Template_ParBetInfo, dist);
            fs.writeFileSync("./src/cmd/betinfo/" + value.RefNo + "_Detail.html", output);

        });
        return output;
    }
}