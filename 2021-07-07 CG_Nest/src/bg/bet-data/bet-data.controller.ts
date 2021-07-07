import { Controller, Get, Query, Logger, Req, Param } from '@nestjs/common';
import * as moment from 'moment';
import { Common } from 'src/util';
import { BgService } from '../bg.service';
import { IResTheirData, Item } from '../model/res.interface';

// 2020/06/30 開案

@Controller('wrc/BG/bet-data')
export class BetDataController {
    constructor(private service: BgService) {
        Logger.debug('build bg !!');
    }
    private static Name: string = "BG.BetDataController";
    @Get()
    public Index() {
        return Common.readHtml('./html/bg.html');
    }

    @Get('GetDateTimeList')
    public APIRequestList(@Query('date') date: string) {

        if (date == undefined || date.length == 0) return [];
        let bt = moment(date + " 23:59:59", Common.Formatter_Moment_1, true) // base time
        if (!bt.isValid()) return [];

        let nt = moment().subtract(5, "m") // @see doc
        if (bt.unix() > nt.unix()) { // is future time ? fix to now
            bt = nt;
        }

        // count step ( 2hour ) => 12 (12*2<day>) => 24
        return Common.DateForwardSplit(
            bt,
            24,
            2,
            "h"
        )

        // this.start("2020-07-02 15:00:00", "2020-07-02 16:55:59")
        // return []
    }

    private static pSize: number = 500; // @see doc ( max value => 500 )
    private static UTC: number = 4; // @ask 

    private async start(s: string, e: string) {
        var st = moment(s, Common.Formatter_Moment_1, true).utc().subtract(BetDataController.UTC, "h").format(Common.Formatter_Moment_1)
        var et = moment(e, Common.Formatter_Moment_1, true).utc().subtract(BetDataController.UTC, "h").format(Common.Formatter_Moment_1)

        let pidx = 1;
        let total = Number.MAX_VALUE
        let list: Item[] = []

        while (BetDataController.pSize * (pidx - 1) < total) {

            let res = await this.service.GetTheirBetData(pidx, BetDataController.pSize, st, et)
            if (res.length == 0) {
                this.service.WriteToFile(`error_range:${st}, ${et}`)
                return // unknow error ?
            }
            let json = <IResTheirData>JSON.parse(res)            
            if (json.error != null) {
                Logger.warn(res, BetDataController.Name)
                return // api error log or write to file
            }

            json.result.items.forEach(x => {
                if (x.orderStatus > 1) { // @see doc valid order status ( start => 2 )
                    if(x.betContent == null) x.betContent = ""
                    if(x.noComm == null) x.noComm = ""
                    list.push(x)
                }
            });

            total = json.result.total;
            pidx++;
            // json.result.page // not sure !?
        }

        if (list.length > 0) {
            // console.log("[time.start]", st)
            // console.log("[time.end]", et)
            this.service.Save(...list)
        }

    }

    @Get('CallBySchedule/:start/:end')
    public async CallBySchedule(@Req() req, @Param() date) {
        this.start(date.start, date.end);
        return JSON.stringify({ "code": "OK", "message": "" })
    }

}
