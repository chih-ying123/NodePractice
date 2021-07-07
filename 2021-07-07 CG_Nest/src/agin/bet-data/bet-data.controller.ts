import { Controller, Get, Query, Header } from '@nestjs/common';
import { Common } from '../../util/Common'
import { AginService } from '../AGIN.service';
import * as request from 'request';
import { get } from 'http';

@Controller('wrc/agin/bet-data')
export class BetDataController {
  constructor(private service: AginService) { }

  @Get()
  public index(): Promise<string> {
    return Common.readHtml('./html/agin.html');
  }

  @Get('APIRequestList')
  public APIRequestList(@Query('date') date: string) {
    let dateTimelist = this.service.generateDateTimeList(date);
    let apiRequest = this.service.generateAPIRequest(dateTimelist, 1, 500);

    //base64編碼
    return apiRequest.map(str => { return Buffer.from(str).toString('base64') });
  }

  @Get('getXML')
  @Header('Content-type', 'application/xml')
  public async getXML(@Query('url') urlBase64: string) {

    if (urlBase64 == null || urlBase64 === '') {
      return { resultCode: 1, resultMessage: "請輸入url參數" };
    }

    let url = Buffer.from(urlBase64, 'base64').toString('utf8');
    let xml = await this.service.getXML(url);

    // url 也傳進去，是為了處理分頁情況, 可以把本次queryString抽取出來，再替換pageIndex
    this.service.processXML(url, xml, true); // true表示要往下處理分頁    
    return xml;
  }
}


/*
Base64 編碼/解碼
  let encode = Buffer.from("Hello World").toString('base64');
  let decode = Buffer.from("SGVsbG8gV29ybGQ=", 'base64').toString('utf8');
*/