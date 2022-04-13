import { Controller, Get, Query, Logger, Req, Param  } from '@nestjs/common';
import { Common } from 'src/util';
import { FCService } from './fc.service';
import * as moment from 'moment';

@Controller('/wrph/fc/bet-data/')
export class BetDataController {

    constructor(private service: FCService) {        
    }

    @Get('/')
    public Index() { 
        return Common.readHtml('./html/fc.html');
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
        
        let startDateValue = (Date.parse(startDate)).valueOf();
        let endDateValue = (Date.parse(endDate)).valueOf();
        let nowValue = Date.now();

        if( startDateValue > nowValue || endDateValue > nowValue ) {
            return "未來時間不可帶入參數";
        }
        else {

            let datas = await this.service.getBetData(startDate, endDate);
            return datas;
        }
        
        
    }

}
