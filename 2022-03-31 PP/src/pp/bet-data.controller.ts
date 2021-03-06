import { Controller, Get, Param, Req, Query  } from '@nestjs/common';
import { Common } from 'src/util';
import * as moment from 'moment';
import { PPService } from './pp.service';

@Controller('/wrv/pp/bet-data/')
export class BetDataController {

    constructor(private service: PPService){}

    @Get('/')
    public Index() {
        return Common.readHtml('./html/pp.html')
    }
    @Get('/RNG')
    public RNG() {
        return Common.readHtml('./html/pp_RNG.html')
    }

    @Get('getDateTimeList')
    public getDateTimeList(@Query('date') date: string) {
        if(date === undefined || date ===''){
            date = moment().format('YYYY-MM-DD');
        }
        let endtime = moment(date + " 23:59:59", Common.Formatter_Moment_1, true)
        let dateTimeList = Common.DateForwardSplit(endtime, 6*24*2, 10, "minutes") //每10分鐘一個區間
        return dateTimeList;
    }

    @Get('getBetData')
    public async getBetData(@Query('start') startTime: string, @Query('end') endTime: string, @Query('dataType') dataType: string ){

        let datas = await this.service.getBetData(startTime, endTime, dataType);
        return datas;
    }
}
