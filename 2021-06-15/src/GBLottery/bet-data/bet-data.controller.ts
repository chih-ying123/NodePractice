import { Controller, Get, Query, Logger, Req, Param } from '@nestjs/common';
import * as moment from 'moment';
import { Common } from 'src/util';
import { GBLotteryService } from '../GBLottery.service';
import { APIResponse, Result, ReturnSet, SettleList, betdata } from '../model/BetData.interface';
import * as fs from 'fs'

@Controller('wrin/GBLottery/bet-data')
export class BetDataController {
    constructor(private service: GBLotteryService) {
        Logger.debug('build GBLottery !!');
    }
    private static Name: string = "GBLottery.BetDataController";
    @Get()
    public Index() { 
        return Common.readHtml('./html/GBLottery.html');
    }
    @Get('GetID')
    public async GetID() {
        const fileName = 'GBLottery_ID.txt';
        var ReadID = fs.readFileSync(fileName, 'utf8')
        // console.log('ReadID', ReadID)
        return ReadID;
    }
    @Get('GetTheirBetData/:ID')
    public async GetTheirBetData(@Req() req, @Param() param) {
        console.log("GBLottery 傳送過來的ID:" + param.ID);
        //一般注單資料
        let res = await this.service.GetTheirBetData(param.ID);
        // console.log(jBetDatas)
        let Response = <APIResponse>JSON.parse(res);
        let GB = Response.GB;
        let Result = GB.Result;
        let ReturnSet = Result.ReturnSet;
        let SettleList = ReturnSet.SettleList;
        // console.log(SettleList)
        console.log('GBLottery 資料 => ', ReturnSet.BetTotalCnt, ' 筆');
        if (SettleList.length === 0) {
            // console.log('Data Empty', res);
            return { ID: param.ID };
        } else {
            let MaxId = Math.max(...SettleList.map(p => p.SettleID))
            fs.writeFile('GBLottery_ID.txt', MaxId, function (error) {
                if (error) {
                    console.log('GBLottery_ID文件寫入失敗')
                } else {
                    console.log('GBLottery_ID寫入成功')
                }
            })
        }
        if (Result.Success != 1) {
            Logger.warn(res, BetDataController.Name)
            return // api error log or write to file
        }
        if (SettleList != null && SettleList!=undefined){
            this.service.SaveDataIntoDB(SettleList)
        }
    }
}
