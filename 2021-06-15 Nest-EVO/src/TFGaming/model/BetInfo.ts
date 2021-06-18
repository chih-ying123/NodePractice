import * as fs from 'fs';
import { Common } from "src/util";
import { Result } from '../model/res.interface'
import * as moment from 'moment';

export class BetInfo {
    public static Template_BetInfo: string;

    public static init() {
        BetInfo.Template_BetInfo = fs.readFileSync("./src/TFGaming/views/template_betinfo.html", "utf8");
    }

    public static ToHtml(bet: Result) {
        if (bet.is_combo != true) {
            var itemList = [];
            let item = {
                match: bet.competition_name,
                league: bet.event_name,
                betOption: bet.bet_selection,
                hdp: bet.handicap,
                odds: bet.member_odds,
                oddtype: bet.member_odds_style,
                status: ResultStatus(bet.result_status),
                eventId: bet.event_id,
                marketType: PlayType(bet.bet_type_name),
                ticketType: TicketType(bet.ticket_type),
            };
            itemList.push(item);
        } else {
            var itemList = [];
    
            bet.tickets.forEach((value) => {
                var eventTime = moment(value.event_datetime).utc().add(8, "h").format(Common.Formatter_Moment_1)
                let item = {
                    match: value.competition_name,
                    league: value.event_name,
                    betOption: value.bet_selection,
                    hdp: value.handicap,
                    odds: value.member_odds,
                    oddtype: bet.member_odds_style,
                    status: ResultStatus(value.result_status),
                    marketType: PlayType(value.bet_type_name),
                    ticketType: TicketType(value.ticket_type),
                    eventdatetime: eventTime,
                    eventId: value.event_id,
                    gametypename: value.game_type_name
                };
                itemList.push(item);
            });
        }
        function PlayType(Value) {
            let dict = {
                "WIN": "主盘口独赢",
                "1X2": "独赢",
                "AH": "让分局",
                "OU" : "大小",
                "OE" : "单双",
                "SPWINMAP" : "局独赢",
                "WINMAP" : "局独赢比分",
                "SPHA" : "特别主客",
                "SPYN" : "特别是否",
                "SPOE" : "特别单双",
                "SPOU" : "特别大小",
                "SP1X2" : "特别1X2",
                "OR" : "冠军盘",
                "SPOR" : "特别多项",
                "SPXX" : "特别双项"
            }
            return dict[Value];
        }
        function TicketType(Value) {
            let dict = {
                "db": "早盘",
                "live": "滚球",
            }
            return dict[Value];
        }
        function ResultStatus(Value) {
            
            if (Value==null){
                return "未結算"
            }else{
                let dict = {
                    "WIN": "赢",
                    "LOSS": "输",
                    "DRAW": "和",
                    "CANCELLED": "取消"
                }
                return dict[Value];
            }
        }
        //console.log(JSON.stringify(itemList));
        var dist = {
            orderTime: bet.date_created,
            items: itemList
        }
        if (!fs.existsSync("./src/TFGaming/betinfo")) {
            fs.mkdir("./src/TFGaming/betinfo", { recursive: true }, (err) => {
                if (err) throw err;
            });
        }
        if (bet.is_combo != true) {
            let output = Common.renderHtml(BetInfo.Template_BetInfo, dist);
            fs.writeFileSync("./src/TFGaming/betinfo/" + bet.id + ".html", output);
            return output;
        } else {
            let output = Common.renderHtml(BetInfo.Template_BetInfo, dist);
            fs.writeFileSync("./src/TFGaming/betinfo/" + bet.id + "detail" + ".html", output);
            return output;
        }



    }
}