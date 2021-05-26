import { Controller, Get, Query, Logger, Req, Param } from '@nestjs/common';
import * as moment from 'moment';
import { stringify } from 'querystring';
import { Common } from 'src/util';
import { JiliService } from '../jili.service';
import { Result, IResponse, Pagination, ResponseList } from '../model/res.interface';
import { v1 as uuidV1 } from 'uuid';
import { Response } from 'express';

@Controller('wrv/jili/bet-data')
export class BetDataController {
    constructor(private service: JiliService) {
        Logger.debug('build jili !!');
    }
    private static Name: string = "Jili.BetDataController";
    @Get()
    public Index() {
        return Common.readHtml('./html/jili.html');
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
    // private static UTC: number = 4; // @ask 


    private async start(s: string, e: string) {
        var st = moment(s, Common.Formatter_Moment_1, true).format(Common.Formatter_Moment_2)
        var et = moment(e, Common.Formatter_Moment_1, true).format(Common.Formatter_Moment_2)

        let pidx = 1;
        let list: ResponseList[] = []
        let res = await this.service.GetTheirBetData(pidx, BetDataController.pSize, st, et)
        if (res.length == 0) {
            this.service.WriteToFile(`error_range:${st}, ${et}`);
            return;
        }

        // console.log(res);
        //JSON.parse中遇到的BIGINT，比較常見的場景為後台返回了一串JSON但是數字為BIGINT導致解析錯誤,一般為16位
        var JSONbig = require('json-bigint');
        let json = <IResponse>JSONbig.parse(res);

        console.log("JILI:" + st + "-" + et + ">>(" + json.ErrorCode + ")" + json.Message);
        if (json.ErrorCode != '0') {
            return;
        }

        let Data = json.Data;
        let Result = Data.Result;
        let TotalPages = Data.Pagination.TotalPages;
        let CurrentPage = Data.Pagination.CurrentPage;
        list.push(Data)
        //console.log('json', json)
        if (Result.length > 0 && TotalPages > CurrentPage) {
            do {
                CurrentPage++;
                let test = await this.service.GetTheirBetData(CurrentPage, BetDataController.pSize, st, et)
                let json = <IResponse>JSON.parse(test)
                let Data = json.Data;
                // console.log('TotalPages', TotalPages);
                // console.log('CurrentPage', CurrentPage);
                // console.log("Result", Data.Result)
                // console.log('injson', json)
                list.push(Data)
            } while (TotalPages > CurrentPage);
        }
        if ((TotalPages = CurrentPage) && Result != null && Result.length > 0) {
            this.service.Save(...list)
            list.forEach(element => {
                // console.log(element);
            });
        }

    }
    @Get('CallBySchedule/:start/:end')
    public async CallBySchedule(@Req() req, @Param() date) {
        this.start(date.start, date.end);
        return JSON.stringify({ "code": "OK", "message": "" })
    }


}
