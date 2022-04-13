import { Controller, Get, Query, Logger, Req, Param } from '@nestjs/common';
import { json } from 'express';
import * as moment from 'moment';
import { Common } from 'src/util';
import { AWSService } from '../AWS.service';
import { Item, IResTheirData, Data } from '../model/res.interface';



@Controller('wrin/AWS/bet-data')
export class BetDataController {
  constructor(private service: AWSService) {
    Logger.debug('build AWS !!');
  }
  private static Name: string = "AWS.BetDataController";
  @Get()
  public Index() {
    return Common.readHtml('./html/AWS.html');
  }

  @Get('GetDateTimeList')
  public APIRequestList(@Query('date') date: string) {

    let dateTimelist = [];
    if (date != null && /\d\d\d\d-\d\d-\d\d/.test(date)) {
      dateTimelist = Common.dateSplitByMin(date, 5);
    }
    else {

      dateTimelist = Common.DateForwardSplit(moment(), 3, 5, "minutes");

    }
    return dateTimelist
  }

  private async start(s: string, e: string) {
      var st = moment(s, Common.Formatter_Moment_1, true).format(Common.Formatter_Moment_1);
      var et = moment(e, Common.Formatter_Moment_1, true).format(Common.Formatter_Moment_1);

      let res = await this.service.GetTheirBetData(st, et)
      let list: Item[] = []
      // console.log('res:', JSON.parse(res));
      console.log('【AWS】', 'start:', st, 'end:', et)
      console.log('res:', res);
      if (res.length == 0) {
        this.service.WriteToFile(`error_range:${st}, ${et}`)
        return // unknow error ?
      }
      let Result = JSON.parse(res)
      let Data = Result.data
      if (Result.code != 0) {
        Logger.warn(res, BetDataController.Name)
        return // api error log or write to file
      }
      if (Data != null) {
        Data.items.forEach(x => {
           console.log('AWS_item', x)
          list.push(x)
        });
      }
      if (list.length > 0) {
        this.service.Save(...list)
      }
  }

  @Get('CallBySchedule/:start/:end')
  public async CallBySchedule(@Req() req, @Param() date) {
    this.start(date.start, date.end);
    return JSON.stringify({ "code": "OK", "message": "" })
  }
}
