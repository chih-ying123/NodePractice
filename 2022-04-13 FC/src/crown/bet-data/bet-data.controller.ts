import { Controller, Get, Query, Logger, Req, Param } from '@nestjs/common';
import { json } from 'express';
import * as moment from 'moment';
import { Common } from 'src/util';
import { crownService } from '../crown.service';
import { IResTheirData, IResParData, Result, ParResult } from '../model/res.interface';



@Controller('wrin/crown/bet-data')
export class BetDataController {
    constructor(private service: crownService) {
        Logger.debug('build crown !!');
    }
    private static Name: string = "crown.BetDataController";
    @Get()
    public Index() {
        return Common.readHtml('./html/crown.html');
    }

    @Get('GetDateTimeList')
    public APIRequestList(@Query('date') date: string) {

        if (date == undefined || date.length == 0) return [];
        let bt = moment(date + " 23:59:59", Common.Formatter_Moment_1, true) // base time
        if (!bt.isValid()) return [];

        let nt = moment().subtract(5, "m") // @see doc
        if (bt.unix() > nt.unix()) { // is future time ? fix to now
            bt = nt;
        }

        // count step ( 2hour ) => 12 (12*2<day>) => 24
        return Common.DateForwardSplit(
            bt,
            24,
            2,
            "h"
        )

    }

    private static pSize: number = 50; // @see doc ( max value => 50 )
    private static UTC: number = 4; //@see doc 
    private async start(s: string, e: string) {
        var st = moment(s, Common.Formatter_Moment_1, true).utc().subtract(BetDataController.UTC, "h").format(Common.Formatter_Moment_1)
        var et = moment(e, Common.Formatter_Moment_1, true).utc().subtract(BetDataController.UTC, "h").format(Common.Formatter_Moment_1)
        let pidx = 1;
        let total = Number.MAX_VALUE

        //while (BetDataController.pSize * (pidx - 1) < total) {
	while (pidx <= total) {
            let res = await this.service.GetTheirBetData(pidx, st, et)
	    let jsonres=JSON.parse(res);
             //console.log('【crown】res:', JSON.parse(res));
            console.log('【crown】', 'start:', st, 'end:', et, jsonres.Error)
            if (res.length == 0) {
                this.service.WriteToFile(`error_range:${st}, ${et}`)
                return // unknow error ?
            }
            let Result = JSON.parse(res);
            //如果有兌現單，會回傳原始單內容在wager_cashout
            let CashoutData = Result.wager_cashout;
            let Data = Result.wager_data;
            if (/0003/.test(Result.respcode) == false && /0000/.test(Result.respcode) == false) {
                Logger.warn(res, BetDataController.Name)
                return // api error log or write to file
            }
            if (Data != null) {
                Data.forEach(x => {
                    // console.log('x',x)
                    if (x['parlaynum'] == null) {
                        // console.log('cashoutid',x['cashoutid'])
                    /*一般單*/
                        if (x['cashoutid'] != '0' ) {
                            // console.log('有兌現單')
                            CashoutData.forEach(e => {
                                if (x['cashoutid'] == e.id){
                                    // console.log('e.id', e.id)
                                    x.cashoutdata = e;
                                    this.service.Save(x)
                                }
                            });
                         
                        }else{
                            x.cashoutdata=`${null}`
                            this.service.Save(x)
                        }
                    }else{
                    /*過關單*/
                            this.service.SaveParlist(x)
                    }
                
                });
            }
            total = Result.wager_totalpage;
		console.log('【crown】', 'page:',pidx, 'totalpage:', total);
            pidx++;
        }
    }

    @Get('CallBySchedule/:start/:end')
    public async CallBySchedule(@Req() req, @Param() date) {
        this.start(date.start, date.end);
        return JSON.stringify({ "code": "OK", "message": "" })
    }

}
