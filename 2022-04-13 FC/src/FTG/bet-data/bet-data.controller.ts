import { Controller, Get, Query, Logger, Req, Param } from '@nestjs/common';
import * as moment from 'moment';
import { Common } from 'src/util';
import { FTGService } from '../FTG.service';
import { IResTheirData,  IResTheirErrorData, Result } from '../model/res.interface';



@Controller('wrin/FTG/bet-data')
export class BetDataController {
    constructor(private service: FTGService) {
        Logger.debug('build FTG !!');
    }
    private static Name: string = "FTG.BetDataController";
    @Get()
    public Index() {
        return Common.readHtml('./html/FTG.html');
    }

    @Get('GetDateTimeList')
    public APIRequestList(@Query('date') date: string) {
        let dateTimelist = [];

        if (date != null && /\d\d\d\d-\d\d-\d\d/.test(date)) {
            dateTimelist = Common.dateSplitByMin(date, 5);
        }
        else {
            let yesterday = moment().subtract(1, 'days').format('YYYY-MM-DD');
            // 取今日
            let today = moment().format('YYYY-MM-DD');
            // 合併2個陣列
            let yesterdayList = Common.dateSplitByMin(yesterday, 5);
            let todayList = Common.dateSplitByMin(today, 5);

            dateTimelist = yesterdayList.concat(todayList);
        }

        return dateTimelist
    }

    private static pSize: number = 1000; // @see doc ( max value => 1000 )
    private static UTC: number = 0; // @ask 
    private async start(s: string, e: string) {
        var st = moment(s, Common.Formatter_Moment_1, true).utc().subtract(BetDataController.UTC, "h").format()
        var et = moment(e, Common.Formatter_Moment_1, true).utc().subtract(BetDataController.UTC, "h").format()
        let pidx = 1;
        let total = Number.MAX_VALUE
        let list: Result[] = []

        while (BetDataController.pSize * (pidx - 1) < total) {
            let res = await this.service.GetTheirBetData(pidx, BetDataController.pSize, st, et)
            // console.log('res:',JSON.parse(res));
            console.log('【FTG】','modified_datetime_start:', st, 'modified_datetime_end:', et)
            if (res.length == 0) {
                this.service.WriteToFile(`error_range:${st}, ${et}`)
                return // unknow error ?
            }
            let json = <IResTheirData>JSON.parse(res)
            let jsonerror = <IResTheirErrorData>JSON.parse(res)
            if (jsonerror.error_code != null) {
                console.log('modified_datetime_start: ', st, 'modified_datetime_end: ', et, 'error: ', jsonerror.error_msg, 'code: ', jsonerror.error_code)
                Logger.warn(res, BetDataController.Name)
                return // api error log or write to file
            }
            if (json.rows != null) {
                json.rows.forEach(x => {
                    list.push(x)
                });
            }
            total = json.total;
	    console.log('【FTG】','total :', total)
            pidx++;

        }
        if (list.length > 0) {
            // console.log("[time.start]", st)
            // console.log("[time.end]", et)
            this.service.Save(...list);
        }

    }

    @Get('CallBySchedule/:start/:end')
    public async CallBySchedule(@Req() req, @Param() date) {
        this.start(date.start, date.end);
        return JSON.stringify({ "code": "OK", "message": "" })
    }

}
