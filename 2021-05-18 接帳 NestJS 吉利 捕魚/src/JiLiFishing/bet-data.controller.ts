import { Controller, Get, Query, Logger, Req, Param } from '@nestjs/common';
import { Common } from 'src/util';
import { JiLiFishingServiceService } from './ji-li-fishing-service.service';


@Controller('wrv/jiliFishing/bet-data')
export class BetDataController {

    constructor(private service: JiLiFishingServiceService) {       
    }

    @Get('/')
    public Index() {
        return Common.readHtml('./html/jiliFishing.html');
    }
    
    //wrv/jiliFishing/bet-data/getDateTimeList
    @Get('getDateTimeList') 
    public getDateTimeList(@Query('date') date: string) {

        if(date === undefined || date ===''){
            date = Common.getYYYYMMDDhhmmss(new Date()).substring(0, 10);
        }
        let dateTimeList = Common.dateSplitByMin(date, 60);
        return dateTimeList.reverse()  // 反向排序送出去
    }

    @Get('getBetData') async getBetData(@Query('start') start: string, @Query('end') end: string){

        let pageIndex = 1;
        let pageSize = 1000;
        let datas = await this.service.getBetData(start, end, pageIndex, pageSize);
        return datas;
    }
}
