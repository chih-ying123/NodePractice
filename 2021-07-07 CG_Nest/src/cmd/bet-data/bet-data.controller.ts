import { Controller, Get, Query, Logger, Req, Param } from '@nestjs/common';
import * as moment from 'moment';
import { Common } from 'src/util';
import { CmdService } from '../cmd.service';
import { APIResponse } from '../model/BetData.interface';
import { ParAPIResponse } from '../model/ParBetData.interface';
import { json } from 'express';
import * as fs from 'fs'

@Controller('wrc/cmd/bet-data')
export class BetDataController {
    constructor(private service: CmdService) {
        Logger.debug('build cmd !!');
    }
    @Get()
    public Index() { 
        return Common.readHtml('./html/cmd.html');
    }
    @Get('GetID')
    public async GetID() {
        const fileName = 'CMD_ID.txt';
        var ReadID = fs.readFileSync(fileName, 'utf8')
        // console.log('ReadID', ReadID)
        return ReadID;
    }
    @Get('GetTheirBetData/:ID')
    public async GetTheirBetData(@Req() req, @Param() param) {
        console.log("CMD 傳送過來的ID:" + param.ID);
        //一般注單資料
        let jBetDatas = await this.service.GetTheirBetData(param.ID);
        let NormalResult =JSON.parse(jBetDatas);
        let NormalResultData = NormalResult.Data;
        console.log('CMD 資料 => ', NormalResultData.length, ' 筆');
        if (NormalResultData.length === 0) {
            //console.log('Data Empty', jBetDatas);
            return { ID: param.ID };
        } else {
            let MaxId = Math.max(...NormalResultData.map(p => p.Id))
            fs.writeFile('CMD_ID.txt', MaxId, function (error) {
                if (error) {
                    console.log('CMD_ID文件寫入失敗')
                } else {
                    //console.log('CMD_ID寫入成功')
                }
            })
            //10
            let doNCount = 0;
            let parCount = 0;
            let ResponseList: APIResponse[] = [];
            NormalResultData.forEach(element => {
                    //console.log('一般');
                    parCount++;
                    let HomeId = this.service.GetInfoBetData(element.HomeTeamId, '0').then(res => {
                        let Result = JSON.parse(res);
                        let ResultData = Result.Data;
                        let Name = ResultData['zh-CN'];
                        return Name;
                    });
                    let AwayId = this.service.GetInfoBetData(element.AwayTeamId, '0').then(res => {
                        let Result = JSON.parse(res);
                        let ResultData = Result.Data;
                        let Name = ResultData['zh-CN'];
                        return Name;
                    });
                    let LeagueId = this.service.GetInfoBetData(element.LeagueId, '1').then(res => {
                        let Result = JSON.parse(res);
                        let ResultData = Result.Data;
                        let Name = ResultData['zh-CN'];
                        return Name;
                    });
                    let HTHomeScore = this.service.GetSportBetData(element.SocTransId).then(res => {
                        let Result = JSON.parse(res);
                        let ResultData = Result.Data;
                        let HTHomeScore = ResultData['HTHomeScore'];
                        return HTHomeScore;
                    });
                    let HTAwayScore = this.service.GetSportBetData(element.SocTransId).then(res => {
                        let Result = JSON.parse(res);
                        let ResultData = Result.Data;
                        let HTAwayScore = ResultData['HTAwayScore'];
                        return HTAwayScore;
                    });
                    Promise.all([HomeId, AwayId, LeagueId, HTHomeScore, HTAwayScore]).then(res => {
                        doNCount++
                        //將資料塞進
                        element.HomeTeamName = res[0]
                        element.AwayTeamName = res[1]
                        element.LeagueName = res[2]
                        element.HTHomeScore = res[3]
                        element.HTAwayScore = res[4]
                        if (doNCount == parCount) {
                            try {
                                //console.log('將一般單存進DB')
                                if (ResponseList.length > 0) {
                                    this.service.SaveDataIntoDB(NormalResult);
                                }
                            } catch (err) {
                                return err
                            }
                        }
                    });
                if (element.TransType == 'PAR') {
                    //console.log('混合')
                    //抓所有混合過關的SocTransId
                    let SocTransID = element.SocTransId;
                    //console.log('混合過關單的ID', SocTransID);
                    let TotalCount = 0;
                    let doCount = 0;
                     //將混合過關的SocTransID分別帶進請求API
                    this.service.GetPARBetData(SocTransID).then(res => {
                        //將回傳結果轉成物件
                        var ParResponse = <ParAPIResponse>JSON.parse(res);
                        //console.log('混合過關單細單', ParResponse)
                        let ParSubData = ParResponse.Data;
                        // console.log('ParSubData', ParSubData);
                        TotalCount += ParSubData.length;
                        ParSubData.forEach((item) => {
                            let HomeId = this.service.GetInfoBetData(item.HomeId, '0').then(res => {
                                let Result = JSON.parse(res);
                                let ResultData = Result.Data;
                                let Name = ResultData['zh-CN'];
                                return Name;
                            });
                            let AwayId = this.service.GetInfoBetData(item.AwayId, '0').then(res => {
                                let Result = JSON.parse(res);
                                let ResultData = Result.Data;
                                let Name = ResultData['zh-CN'];
                                return Name;
                            });
                            let LeagueId = this.service.GetInfoBetData(item.LeagueId, '1').then(res => {
                                let Result = JSON.parse(res);
                                let ResultData = Result.Data;
                                let Name = ResultData['zh-CN'];
                                return Name;
                            });
                            Promise.all([HomeId, AwayId, LeagueId]).then(res => {
                                doCount++
                                //將資料塞進
                                item.HomeTeamName = res[0]
                                item.AwayTeamName = res[1]
                                item.LeagueName = res[2]
                                if (TotalCount== doCount) {
                                    try {
                                        //console.log('將混合過關細單存進DB')
                                            this.service.SaveParDataIntoDB(SocTransID, ParResponse);
                                    } catch (err) {
                                        return err
                                    }
                                }
                            });
                        });
                    });
                }
            });
        }
    }
}
