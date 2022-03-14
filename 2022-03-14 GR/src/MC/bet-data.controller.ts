import { Controller, Get, Query, Logger, Req, Param  } from '@nestjs/common';
import { Common } from 'src/util';
import { MCService } from './mc.service';
import * as moment from 'moment';

@Controller('/wrt/mc/bet-data')
export class BetDataController {

    constructor(private service: MCService) {        
    }

    @Get('/')
    public Index() { 
        return Common.readHtml('./html/mc.html');
    }

    @Get('getDateTimeList')
    public getDateTimeList(@Query('date') date: string) {
        if(date === undefined || date ===''){
            date = moment().format('YYYY-MM-DD');
        }
        let endtime = moment(date + " 23:59:59", Common.Formatter_Moment_1, true)
        let dateTimeList = Common.DateForwardSplit(endtime, 192, 15, "m") //時間查詢範圍上限15分鐘
        return dateTimeList;
    }

    @Get('getBetData')
    public async getBetData(@Query('start') startDate: string, @Query('end') endDate: string){
        
        let datas = await this.service.getBetData(startDate, endDate);
        return datas;
    }

}
