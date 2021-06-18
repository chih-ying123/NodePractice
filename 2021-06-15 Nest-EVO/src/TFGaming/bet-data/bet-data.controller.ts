import { Controller, Get, Query, Logger, Req, Param } from '@nestjs/common';
import * as moment from 'moment';
import { Common } from 'src/util';
import { TFGamingService } from '../TFGaming.service';
import { IResTheirData, Item, IResTheirErrorData, Result } from '../model/res.interface';

// 2020/06/30 開案

@Controller('wrin/TFGaming/bet-data')
export class BetDataController {
    constructor(private service: TFGamingService) {
        Logger.debug('build TFGaming !!');
    }
    private static Name: string = "TFGaming.BetDataController";
    @Get()
    public Index() {
        return Common.readHtml('./html/TFGaming.html');
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

    private static pSize: number = 500; // @see doc ( max value => 1000 )
    private static UTC: number = 0; // @ask 
    private async start(s: string, e: string) {
        var st = moment(s, Common.Formatter_Moment_1, true).utc().subtract(BetDataController.UTC, "h").format(Common.Formatter_Moment_2)
        var et = moment(e, Common.Formatter_Moment_1, true).utc().subtract(BetDataController.UTC, "h").format(Common.Formatter_Moment_2)
        let pidx = 1;
        let total = Number.MAX_VALUE
        let list: Result[] = []

        while (BetDataController.pSize * (pidx - 1) < total) {
            let res = await this.service.GetTheirBetData(pidx, BetDataController.pSize, st, et)
            // console.log('res:',JSON.parse(res));
            console.log('【TFGaming】','modified_datetime_start:', st, 'modified_datetime_end:', et)
            if (res.length == 0) {
                this.service.WriteToFile(`error_range:${st}, ${et}`)
                return // unknow error ?
            }
            let json = <IResTheirData>JSON.parse(res)
            let jsonerror = <IResTheirErrorData>JSON.parse(res)
            if (jsonerror.errors != null) {
                console.log('modified_datetime_start: ', st, 'modified_datetime_end: ',et,'error: ', jsonerror.errors, 'code: ', jsonerror.code)
                Logger.warn(res, BetDataController.Name)
                return // api error log or write to file
            }
            if (json.results != null) {
                json.results.forEach(x => {
                    list.push(x)
                });
            }

            total = json.count;
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
