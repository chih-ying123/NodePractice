import { Controller, Get, Query, Logger, Req, Param } from '@nestjs/common';
import * as moment from 'moment';
import { Common } from 'src/util';
import { IcgService } from '../icg.service';
import {  IResponse, ResponseList } from '../model/res.interface';
@Controller('wrin/icg/bet-data')
export class BetDataController {
    constructor(private service: IcgService) {
        Logger.debug('build icg !!');
    }
    @Get()
    public Index() {
        return Common.readHtml('./html/icg.html');
    }

    @Get('GetDateTimeList')
    public APIRequestList(@Query('date') date: string) {

        if (date == undefined || date.length == 0) return [];
        let bt = moment(date + " 23:59:59", Common.Formatter_Moment_1, true) // base time
        if (!bt.isValid()) return [];

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

    private static pSize: number = 1000; // @ask max 10000


    private async start(s: string, e: string) {
        var getst = moment(s).unix();
        var getet = moment(e).unix();
        //需補到毫秒 所以乘以一千
        var st = getst*1000
        var et = getet*1000
        // var st = moment(s).utc().subtract(0, "h").format(Common.Formatter_Moment_2);
        // var et = moment(e).utc().subtract(0, "h").format(Common.Formatter_Moment_2);
        let pidx = 1;
        let list: ResponseList[] = []
        let total = Number.MAX_VALUE

        while (BetDataController.pSize * (pidx - 1) < total) {
            
            let res = await this.service.GetTheirBetData(pidx, BetDataController.pSize, st, et)
            if (res.length == 0) {
                this.service.WriteToFile(`error_range:${st}, ${et}`)
                return 
            }
            if (/"status": "400"/.test(res)) {
                return [];
            }
            let json = <IResponse>JSON.parse(res)
            console.log("ICG => [time.start]", st, "[time.end]", et);
            //console.log(res);
            json.data.forEach(x => {
                    list.push(x)
            });

            total = json.totalSize;
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
