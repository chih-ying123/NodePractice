import { Controller, Get, Param, Req, Query } from '@nestjs/common';
import { Common } from 'src/util';
import { CgService } from './cg.service';

@Controller('wrv/cg/bet-data')
export class CgController {

    constructor(private service: CgService){}

    @Get('/')
    public Index() {
        return Common.readHtml('./html/cg.html')
    }

    @Get('getDateTimeList')
    public getDateTimeList(@Query('date') date: string) {
        if(date === undefined || date ===''){
            date = Common.getDateStr_FromDate(new Date()).substring(0, 10);
        }
        let dateTimeList = Common.dateSplitByMin(date, 60);
        return dateTimeList.reverse() 
    }

    @Get('getBetData')
    public async getBetData(@Query('start') startDate: string, @Query('end') endDate: string){
        
        let datas = await this.service.getBetData(startDate, endDate);
        return datas;
    }
}
