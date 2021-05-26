import { Controller, Get, Query, Logger, Req, Param } from '@nestjs/common';
import { Common } from 'src/util';
import { JiLiFishingService } from './ji-li-fishing.service';
import { Result, IResponse, Pagination, ResponseList } from './res.interface';

@Controller('wrv/JiLiFishing/bet-data')
export class BetDataController {

    constructor(private service: JiLiFishingService) {       
    }

    @Get()
    public Index() {
        return Common.readHtml('./html/JiLiFishing.html');
    }

    @Get('getDateTimeList') 
    public getDateTimeList(@Query('date') date:string) {

        if (date === undefined || date === ''){
            date = Common.getYYYYMMDDhhmmss(new Date()).substring(0, 10);
        }

        let dateTimeList = Common.dateSplitByMin(date, 60);
        return dateTimeList.reverse() //反向排序
    }

    @Get('getBetData') 
    public async getBetData(@Query('start') start:string, @Query('end') end:string){

        let pageIndex = 1;
        let pageSize = 1000;
        let apiResponse: IResponse = await this.service.getBetData(start, end, pageIndex, pageSize);
        
        //分頁處理
        let allDatas = [];
        for(let i=2; i<apiResponse.Data.Pagination.TotalPages; i++)
        {
            let nextAPIResponse: IResponse = await this.service.getBetData(start, end, i, pageSize);            
            allDatas = allDatas.concat(nextAPIResponse.Data.Result);
        }
      
        /*
            let Data = apiResponse.Data;
            let TotalPages = Data.Pagination.TotalPages;
            let CurrentPage = Data.Pagination.CurrentPage;        
            console.log(TotalPages, CurrentPage);
        */
        
        
        return allDatas;
    }
}
