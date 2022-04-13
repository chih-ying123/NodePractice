import { Controller, Get, Query, Logger, Req, Param } from '@nestjs/common';
import * as moment from 'moment';
import { Common } from 'src/util';
import { rich88Service } from '../rich88.service';
import { IResTheirData, Item } from '../model/res.interface';


@Controller('wrin/rich88/bet-data')
export class BetDataController {
    constructor(private service: rich88Service) {
        Logger.debug('build rich88 !!');
    }
    private static Name: string = "rich88.BetDataController";
    @Get()
    public Index() {
        return Common.readHtml('./html/rich88.html');
    }

    @Get('GetDateTimeList')
    public APIRequestList(@Query('date') date: string) {

        if (date == undefined || date.length == 0) return [];
        let bt = moment(date + " 23:59:59", Common.Formatter_Moment_1, true)// base time
        //let bt = moment(date + " 23:59:59", Common.Formatter_Moment_1, true).utc().subtract(12, "h")// base time
        if (!bt.isValid()) return [];

        // count step ( 2hour ) => 12 (12*2<day>) => 24
        return Common.DateForwardSplit(
            bt,
            24,
            2,
            "h"
        )

    }

    private static pSize: number = 500; // @see doc ( max value => 500 )
    private static UTC: number = 0;
    private async start(s: string, e: string) {
        var st = moment(s, Common.Formatter_Moment_1, true).utc().add(BetDataController.UTC, "h").format(Common.Formatter_Moment_1)
        var et = moment(e, Common.Formatter_Moment_1, true).utc().add(BetDataController.UTC, "h").format(Common.Formatter_Moment_1)

        let pidx = 1;
        let total = Number.MAX_VALUE
        let list: Item[] = []

        while (BetDataController.pSize * (pidx - 1) < total) {

            let res = await this.service.GetTheirBetData(pidx, BetDataController.pSize, st, et)
            // console.log(JSON.parse(res));
            if (res.length == 0) {
                this.service.WriteToFile(`error_range:${st}, ${et}`)
                return // unknow error ?
            }
            let json = <IResTheirData>JSON.parse(res)     
            if (json.code != 0) {
            console.log('error: ' + json.msg )
            }
            if (json.code != 0) {
                Logger.warn(res, BetDataController.Name)
                return // api error log or write to file
            }
            if (json.data.bet_record_list != null){
                json.data.bet_record_list.forEach(x => {
                    // console.log(x);
                    list.push(x)
                });
            }
            total = json.data.pagination_info.total_count;
            console.log('total',total)
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
