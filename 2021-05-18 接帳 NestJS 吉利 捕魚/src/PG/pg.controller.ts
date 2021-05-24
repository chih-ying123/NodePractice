import { Controller, Get, Query, Logger, Req, Param } from '@nestjs/common';
import { Common } from 'src/util';
import { PgService } from './pg.service';

@Controller('PG')
export class PgController {

    constructor(private service: PgService){}

    @Get('/')
    public Index() {
        return Common.readHtml('./html/PG.html');
    }

    @Get('/getDateTimeList')
    public getDateTimeList(@Query('date') date: string) {
        if(date === undefined || date ===''){
            date = Common.getYYYYMMDDhhmmss(new Date()).substring(0, 10);
        }
        let dateTimeList = Common.dateSplitByMin(date, 60);
        return dateTimeList.reverse()  // 反向排序送出去
    }

    @Get('/getBetData')
    public async getBetData(@Query('start') startTime:string, @Query('end') endTime:string) {
        let datas = await this.service.getBetData(startTime, endTime);
        return datas;
    }
}
