import { Controller, Get, Param, Req, Query } from '@nestjs/common';
import * as moment from 'moment';
import { Response, IResSubBet } from '../model/res.interface'
import { SboService } from '../SBO.service';
import { Main } from '../process/main';
import { Common } from "src/util";

@Controller('wrin/sbo/bet-data')
export class BetDataController {
    constructor(private service: SboService) { }

    @Get()
    public index(): Promise<string> {
        return Common.readHtml('./html/sbo.html');
    }

    @Get('APIRequestList')
    public APIRequestList(@Query('date') date: string) {
        let dateTimelist = [];

        if (date != null && /\d\d\d\d-\d\d-\d\d/.test(date)) {
            dateTimelist = Common.dateSplitByMin(date, 120);
        }
        else {
            let yesterday = moment().subtract(1, 'days').format('YYYY-MM-DD');
            // 取今日
            let today = moment().format('YYYY-MM-DD');
            // 合併2個陣列
            let yesterdayList = Common.dateSplitByMin(yesterday, 120);
            let todayList = Common.dateSplitByMin(today, 120);

            dateTimelist = yesterdayList.concat(todayList);
        }

        return dateTimelist
    }

    /**
     * 
     * @param start 注單開始時間
     * @param end 注單結束時間
     */
    private async start(start: string, end: string) {
        let res = await this.getBetData(start, end);
    }

    /**
     * 取得注單
     * @param start 注單開始時間
     */
    private async getBetData(start: string, end: string) {
        
        let res = await this.service.GetTheirBetData(start, end);
        console.log("response:", JSON.parse(res));
        if (res.length == 0) return;

        var res_BetData = <Response>JSON.parse(res);
        
        if(res_BetData.error.id == 0) {
            if (res_BetData.result != undefined && res_BetData.result.length > 0) {
                try {
                        console.log("save data");
                    this.service.Save(res_BetData.result);
                  } catch (err) {
                    return err
                  }
            } else {
                console.log("no data");
            }
        } else {
            console.log("error "+res_BetData.error.id+":"+res_BetData.error.msg);
        }
    }

    // for local exe call ( 固定排程 )
  @Get('CallBySchedule/:start/:end')
  public async CallBySchedule(@Req() req, @Param() date) {
    //if(req.ip != "::ffff:127.0.0.1") return false ; // 鎖本地 IP
    console.log("SBO: schedule:", date );

    this.start(date.start, date.end) ;
    return [date.start, date.end];
  }
  // for external api call
  @Get('CallByDate/:date')
  public async CallByDate(@Param('date') date: string) {
    return "TC Only !!" // 此段先不寫… 保留給 TC
  }

    // @Get('call')
    // public async Call(@Query('d') date: string) {
    //   if (SboService.Active) return "busy";
    //   SboService.Active = true;
  
    //   if (date == null) {
    //     date = moment().format('YYYY-MM-DD');

    //     this.service.GetTheirAllBetData();
    //     // 取昨日
    //     // 取今日
  
    //     // 產生時間區間
    //     // or
    //     // 產生分頁
    //   } else {
    //     // 指定日期
    //     // this.service.GetTheirBetData() ;
    //   }
    //   return "start";
    // }
  
  }
