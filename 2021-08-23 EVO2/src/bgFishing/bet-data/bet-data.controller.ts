import { Controller, Get, Query, Logger, Req, Param } from '@nestjs/common';
import * as moment from 'moment';
import { Common } from 'src/util';
import { BgFishingService } from '../BgFishing.service';
import { IResTheirData, Item } from '../model/res.interface';

// 2020/06/30 開案

@Controller('wrin/BgFishing/bet-data')
export class BetDataController {
    constructor(private service: BgFishingService) {
        Logger.debug('build bg !!');
    }
    private static Name: string = "BG.BetDataController";
    @Get()
    public Index() {
        return Common.readHtml('./html/BgFishing.html');
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

    }

    private static pSize: number = 500; // @see doc ( max value => 500 )

    private async start(s: string, e: string) {
        var st = moment(s, Common.Formatter_Moment_1, true).format(Common.Formatter_Moment_1)
        var et = moment(e, Common.Formatter_Moment_1, true).format(Common.Formatter_Moment_1)

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
            console.log('error: ' + json.error.message + "，reason:"+"【"+json.error.reason+"】")
            }
            if (json.error != null) {
                Logger.warn(res, BetDataController.Name)
                return // api error log or write to file
            }
            if (json.result.items != null){
                json.result.items.forEach(x => {
                    list.push(x)
                });
            }
            total = json.result.total;
            pidx++;
           
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
