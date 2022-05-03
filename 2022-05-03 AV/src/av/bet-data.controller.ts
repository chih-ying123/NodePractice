import { Controller, Get, Param, Req, Query  } from '@nestjs/common';
import { Common } from 'src/util';
import * as moment from 'moment';
import { AVService } from './av.service';

@Controller('/wrt/av/bet-data/')
export class BetDataController {

    constructor(private service: AVService){}

    @Get('/')
    public Index() {
        return Common.readHtml('./html/av.html')
    }

    @Get('getDateTimeList')
    public getDateTimeList(@Query('date') date: string) {
        if(date === undefined || date ===''){
            date = moment().format('YYYY-MM-DD');
        }
        let endtime = moment(date + " 23:59:59", Common.Formatter_Moment_1, true);
        let dateTimeList = Common.DateForwardSplit(endtime, 24*2, 1, "hour"); 
        return dateTimeList;
    }

    @Get('getBetData')
    public async getBetData(@Query('start') startTime: string, @Query('end') endTime: string, @Query('dataType') dataType: string ){

        let datas = await this.service.getBetData(startTime, endTime);
        return datas;
    }
}
