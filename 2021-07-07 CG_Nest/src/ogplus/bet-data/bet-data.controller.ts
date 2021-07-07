import { Controller, Get, Query } from '@nestjs/common';
import * as moment from 'moment';
import { OgplusService } from '../ogplus.service';
import { Common } from '../../util/Common'
import { IToken } from '../model/OGPlus.interface';
import { IBetData } from '../model/BetData.interface';


@Controller('wrc/OGPlus/bet-data')
export class BetDataController {
  constructor(private service: OgplusService) { }

  @Get('/')
  public async index() {
    return Common.readHtml('./html/OGPLus.html');
  }
  @Get('/token')
  public async token() {
    let token: IToken = JSON.parse(await this.service.GetToken());
    return token;
  }

  @Get('APIRequestList')
  public APIRequestList(@Query('date') date: string) {

    let dateTimelist = [];
    if (date != null && /\d\d\d\d-\d\d-\d\d/.test(date)) {
      dateTimelist = Common.dateSplitByMin(date, 10);
    }
    else {

      // 取昨日
      let yesterday = moment().subtract(1, 'days').format('YYYY-MM-DD');
      // 取今日
      let today = moment().format('YYYY-MM-DD');
      // 合併2個陣列
      let yesterdayList = Common.dateSplitByMin(yesterday, 10);
      let todayList = Common.dateSplitByMin(today, 10);
      dateTimelist = yesterdayList.concat(todayList);
    }
    return dateTimelist
  }

  @Get('getBetData')
  public async getBetData(@Query('start') start: string, @Query('end') end: string) {
    let jBetDatas = await this.service.GetBetData(start, end);

    if (jBetDatas === '') return;

    console.log('OGPLus', jBetDatas);
    if (/"status": "error"/.test(jBetDatas)) {
      return [];
    }
    else {

      try {
        let betDatas: IBetData[] = JSON.parse(jBetDatas);
        if (betDatas.length > 0) {
          this.service.SaveDataIntoDB(betDatas);
        }
        return betDatas;
      } catch (err) {
        return err
      }
    }
  }

}
