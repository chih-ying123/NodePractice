import { Controller, Get, Query, Logger, Req, Param  } from '@nestjs/common';
import { Common } from 'src/util';
import { EvoService } from './evo.service';
import * as moment from 'moment';

@Controller('wrin/Evo/bet-data')
export class EvoController {

    constructor(private service: EvoService) {        
    }

    @Get('/')
    public Index() { 
        return Common.readHtml('./html/evo.html');
    }

    @Get('getDateTimeList')
    public getDateTimeList(@Query('date') date: string) {

      let dateTimelist = [];

        if (date != null && /\d\d\d\d-\d\d-\d\d/.test(date)) {
            dateTimelist = Common.dateSplitByMin(date, 60);
        }
        else {
            let yesterday = moment().subtract(1, 'days').format('YYYY-MM-DD');
            // 取今日
            let today = moment().format('YYYY-MM-DD');
            // 合併2個陣列
            let yesterdayList = Common.dateSplitByMin(yesterday, 60);
            let todayList = Common.dateSplitByMin(today, 60);

            dateTimelist = yesterdayList.concat(todayList);
        }

        return dateTimelist


        /*if(date === undefined || date ===''){
            date = Common.getDateStr_FromDate(new Date()).substring(0, 10);
        }
        
        let dateTimeList = Common.dateSplitByMin(date, 60);
        return dateTimeList.reverse() */
    }

    @Get('getBetData')
    public async getBetData(@Query('start') startDate: string, @Query('end') endDate: string){
        
        let datas = await this.service.getBetData(startDate, endDate);
        return datas;
    }

}
