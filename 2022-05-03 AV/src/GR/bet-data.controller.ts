import { Controller, Get, Param, Req, Query  } from '@nestjs/common';
import { Common } from 'src/util';
import * as moment from 'moment';
import { GRService } from './gr.service';

@Controller('/wrt/gr/bet-data/')
export class BetDataController {

    constructor(private service: GRService){}

    @Get('/')
    public Index() {
        return Common.readHtml('./html/gr.html')
    }

    @Get('getDateTimeList')
    public getDateTimeList(@Query('date') date: string) {
        if(date === undefined || date ===''){
            date = moment().format('YYYY-MM-DD');
        }
        let endtime = moment(date + " 23:59:59", Common.Formatter_Moment_1, true)
        let dateTimeList = Common.DateForwardSplit(endtime, 48, 1, "h")
        return dateTimeList;
    }

    @Get('getBetData')
    public async getBetData(@Query('start') startTime: string, @Query('end') endTime: string){
        let currentPage = 1;
        let datas = await this.service.getBetData(startTime, endTime, currentPage);
        return datas;
    }
}
