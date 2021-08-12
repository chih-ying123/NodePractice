import { Controller, Get, Query, Logger, Req, Param } from '@nestjs/common';
import { json } from 'express';
import * as moment from 'moment';
import { Common } from 'src/util';
import { V8PockerService } from '../V8Pocker.service';
import { IResTheirData, Result, item } from '../model/res.interface';



@Controller('wrin/V8Pocker/bet-data')
export class BetDataController {
    constructor(private service: V8PockerService) {
        Logger.debug('build V8Pocker !!');
    }
    private static Name: string = "V8Pocker.BetDataController";
    @Get()
    public Index() {
        return Common.readHtml('./html/V8Pocker.html');
    }

    @Get('GetDateTimeList')
    public APIRequestList(@Query('date') date: string) {

        if (date == undefined || date.length == 0) return [];
        let bt = moment(date + " 23:59:59", Common.Formatter_Moment_1, true) // base time
        if (!bt.isValid()) return [];
        let nt = moment();
        if (bt.unix() > nt.unix()) { // is future time ? fix to now
            bt = nt;
        }

        return Common.DateForwardSplit(
            bt,
            24,
            1,
            "h"
        )

    }

    private async start(s: string, e: string) {

        //13位元timestamp
        var st = moment(s, Common.Formatter_Moment_1, true).valueOf();
        var et = moment(e, Common.Formatter_Moment_1, true).valueOf();
        console.log('【V8Pocker】', 'start:', s, 'end:', e)
        let res = await this.service.GetTheirBetData(st, et);
        let result = <IResTheirData>JSON.parse(res);
        // console.log(res)
        let Data = result.d;
        let DataList = Data.list;
        if (res.length == 0) {
            this.service.WriteToFile(`error_range:${st}, ${et}`)
            return // unknow error ?
        }
        if (Data.code != 0 && Data.code != 16) {
            Logger.warn(res, BetDataController.Name)
            return // api error log or write to file
        }

        if (DataList != null && DataList != undefined ) {
            this.service.Save(Data);
        }

    }

    @Get('CallBySchedule/:start/:end')
    public async CallBySchedule(@Req() req, @Param() date) {
        this.start(date.start, date.end);
        return JSON.stringify({ "code": "OK", "message": "" })
    }

}
