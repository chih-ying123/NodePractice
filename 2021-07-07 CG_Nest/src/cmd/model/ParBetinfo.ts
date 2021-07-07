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