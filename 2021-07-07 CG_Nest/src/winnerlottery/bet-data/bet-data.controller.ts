import { Controller, Get, Query, Logger, Req, Param } from '@nestjs/common';
import * as moment from 'moment';
import { Common } from 'src/util';
import { WinnerlotteryService } from '../winnerlottery.service';
import { IBetData, APIResponse } from '../model/BetData.interface';
import { json } from 'express';

@Controller('wrc/winnerlottery/bet-data')
export class BetDataController {
    constructor(private service: WinnerlotteryService) {
        Logger.debug('build winnerlottery !!');
    }
    @Get()
    public Index() {
        return Common.readHtml('./html/winnerlottery.html');
    }

    @Get('APIRequestList')
    public APIRequestList(@Query('date') date: string) {
        console.log("APIRequestList date:"+date);
        if (date ==  null || date ===''){
            return "0";
        }
        if (/\d\d\d\d-\d\d-\d\d/.test(date)) {
            console.log("WINNER:API", date);
            return date
        } else {
            console.log("APIRequestList return null");
            return "0";
        }
    }

    @Get('GetTheirBetData/:type/:date')
    public async GetTheirBetData(@Req() req, @Param() param) {
        console.log("date:" + param.date + ", type:" + param.type);
        let jBetDatas = await this.service.GetTheirBetData(param.date, param.type, "1");

        if (jBetDatas === '') return;

        console.log('Winnerlottery', jBetDatas);
        if (/"error_code": "error"/.test(jBetDatas)) {
            return [];
        }
        else {

            try {
                console.log('test')
                let betDatas: APIResponse = JSON.parse(jBetDatas);
                if (betDatas.data.length > 0) {
                    this.service.SaveDataIntoDB(betDatas.data);
                }
                return betDatas;
            } catch (err) {
                return err
            }
        }
    }

}
