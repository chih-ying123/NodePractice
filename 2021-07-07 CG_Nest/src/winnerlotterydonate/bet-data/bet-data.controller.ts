import { Controller, Get, Query, Logger } from '@nestjs/common';
import * as moment from 'moment';
import { Common } from 'src/util';
import { WinnerlotterydonateService } from '../winnerlotterydonate.service';
import { IDonate } from '../model/donate.interface';

@Controller('wrc/winnerlotterydonate/bet-data')
export class BetDataController {
    constructor(private service: WinnerlotterydonateService) { 
        Logger.debug('build winnerlotterydonate !!') ;
    }
    @Get()
    public Index() {
        return Common.readHtml('./html/winnerlotterydonate.html');
    }

    @Get('APIRequestList')
    public APIRequestList(@Query('date') date: string) {
        let dateTimelist = [];

        if (date != null && /\d\d\d\d-\d\d-\d\d/.test(date)) {
            dateTimelist.push(date);
        }
        else {
            let day_4 = moment().subtract(4, 'days').format('YYYY-MM-DD');
            let day_3 = moment().subtract(3, 'days').format('YYYY-MM-DD');
            let day_2 = moment().subtract(2, 'days').format('YYYY-MM-DD');
            let day_1 = moment().subtract(1, 'days').format('YYYY-MM-DD');
            let today = moment().format('YYYY-MM-DD');

            dateTimelist.push(today);
            dateTimelist.push(day_1);
            dateTimelist.push(day_2);
            dateTimelist.push(day_3);
            dateTimelist.push(day_4);
        }

        return dateTimelist;
    }


    @Get('getBetData')
    public async getBetData(@Query('date') date: string, @Query('username') username: string) {
        console.log("date:" + date + ", username:" + username);
        let jBetDatas = await this.service.GetTheirBetData(date, username);

        if (jBetDatas === '') return;

        console.log('winnerlotterydonate', jBetDatas);

        try {
            //console.log('test')
            let betDatas:Array<IDonate> = JSON.parse(jBetDatas);
            if (betDatas.length > 0) {
                this.service.SaveDataIntoDB(betDatas);
            }
            return betDatas;
        } catch (err) {
            return err
        }
    }
  
  }
