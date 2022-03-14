import { Controller, Get, Query, Param, Redirect, Catch, Req } from '@nestjs/common';
import * as moment from 'moment';
import * as shell from 'shelljs';

import { RTGService } from '../rtg.service';
import { IToken } from '../model/req.interface';

import { IResTheirData } from '../model/res.interface';
import { Common } from 'src/util';

@Controller('wrv/rtg/bet-data')
export class BetDataController {
  constructor(private service: RTGService) { }

  private async start(start: string, end: string) {
    let res = await this.service.GetToken();
    if (res.length == 0) return;
    let res_Token = <IToken>JSON.parse(res);

    res = await this.service.GetTheirBetData(res_Token.token, moment(start).toISOString(), moment(end).toISOString());

    if (res.length == 0) return;
    var res_BetData = <IResTheirData>JSON.parse(res);

    if (res_BetData.totalCount == 0) return;
    this.service.Save(res_BetData.items);
  }

  @Get()
  //回傳當前狀態 <客端畫面> 先不做處理( 暫時只能使用呼叫方式 ? )
  public Index() {
    return Common.readHtml('./html/rtg.html');
  }
  @Get('APIRequestList')
  public APIRequestList(@Query('date') date: string) {
    if(date==undefined||date.length==0) return "" ;

    let now = moment(date).format(Common.Formatter_Moment_0);
    let yesterday = moment(now).add(-1, "days").format(Common.Formatter_Moment_0);
    return Common.dateSplitByMin(yesterday, 120).concat(Common.dateSplitByMin(date, 120));
  }
  // for local exe call ( 固定排程 )
  @Get('CallBySchedule/:start/:end')
  public async CallBySchedule(@Req() req, @Param() date) {
    // if(req.ip != "::ffff:127.0.0.1") return false ; // 鎖本地 IP
    this.start(date.start, date.end) ;

    return "GJ" ; // 未定義 錯誤 介面
  }

}
