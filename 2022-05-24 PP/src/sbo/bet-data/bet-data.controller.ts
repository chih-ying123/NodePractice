import { Controller, Get, Param, Req, Query } from '@nestjs/common';
import * as moment from 'moment';
import { IResAllBetData, IResAllDetailData, IResBetLogs, ResTheirData, IResDetailBetLogs, IResBetData, IResDetailData } from '../model/res.interface'
import { SboService } from '../SBO.service';
import { Main } from '../process/main';
import { Common } from "src/util";

@Controller('wrv/sbo/bet-data')
export class BetDataController {
    constructor(private service: SboService) { }

    //先存著未結單的ID
    private stakeBetIdMap = new Map<string, IResBetLogs>();
    //要送給SP的資料
    private theirDataArray: ResTheirData[] = [];
    private allBetLogsMap = new Map<string, IResBetLogs>();
    //由betid取得細單
    private detailLogsMap = new Map<string, IResDetailBetLogs>();
    private tmpBetLogs: IResBetLogs[] = [];
    //注單最後更新時間
    private lastBetUpdateTime: number = 0;
    //細單最後更新時間
    private lastDetailUpdateTime: number = 0;
    private isInit = false;

    @Get()
    public index(): Promise<string> {
        return Common.readHtml('./html/sbo.html');
    }

    @Get('APIRequestList')
    public APIRequestList(@Query('date') date: string) {
        let betTime = "0", detailTime = "0";
        let timeList = [];

        console.log("SBO: APIRequestList date:"+date);

        if(date==undefined || date.length==0 || date == "0") {
            if(this.lastBetUpdateTime != 0) {
                betTime = moment(this.lastBetUpdateTime).format('YYYY-MM-DD HH:mm:ss.SSS');
                console.log("SBO: lastBetUpdateTime convert:"+this.lastBetUpdateTime+" to "+betTime);
            }

            if(this.lastDetailUpdateTime != 0) {
                detailTime = moment(this.lastDetailUpdateTime).format('YYYY-MM-DD HH:mm:ss.SSS');
            }
            console.log("SBO: date convert lastDetailUpdateTime:"+this.lastDetailUpdateTime+" to "+detailTime);

            timeList.push({startBet: betTime, startDetail: detailTime});
            return timeList;
        }

        betTime = moment(date).format('YYYY-MM-DD HH:mm:ss.SSS');
        detailTime = betTime;

        console.log("SBO:API ", betTime, ",", detailTime);
        
        timeList.push({startBet: betTime, startDetail: detailTime});
        timeList.push({startBet: moment(this.lastBetUpdateTime).format('YYYY-MM-DD HH:mm:ss.SSS'), startDetail: moment(this.lastDetailUpdateTime).format('YYYY-MM-DD HH:mm:ss.SSS')});
        return timeList;
    }

    private init() {
        this.isInit = true;
        this.stakeBetIdMap.clear();
        this.allBetLogsMap.clear();
        this.detailLogsMap.clear();
        this.tmpBetLogs = [];
        this.theirDataArray = [];
    }

    /**
     * 
     * @param startBet 注單開始時間
     * @param startDetail 細單開始時間
     */
    private async start(startBet: number, startDetail: number) {
        if(!this.isInit) {
            this.init();
        }

        let lastTime = startBet;
        //取得所有注單(goldenf的)
        do {
            lastTime = await this.getBetData(lastTime);
        } while(lastTime != 0);

        lastTime = startDetail;
        //取得所有細單(原廠，goldenf不保證資料正確性)
        do {
            lastTime = await this.getDetailData(lastTime);
        } while(lastTime != 0);

        console.log("SBO: this.allBetLogs.length:"+this.allBetLogsMap.size);
        console.log("SBO: this.allDetailLogs.length:"+this.detailLogsMap.size);

        if((this.allBetLogsMap.size & this.detailLogsMap.size) == 0) {
            this.allBetLogsMap.forEach((value) => {
                console.log("SBO: allBetLogs:"+value.bet_id+", type:"+value.trans_type);
            })

            this.detailLogsMap.forEach((value) => {
                console.log("SBO: detailLogsMap:"+value.bet_id+", type:"+value.status);
            })
        }

        //由注單betid取得對應的細單，並填入要送給SP的欄位
        if(this.allBetLogsMap.size > 0) {
            // for(let i = this.allBetLogs.size - 1; i >= 0; i--) {
            //     let value = this.allBetLogs[i];
            //     if(this.detailLogsMap.has(value.bet_id)) {
            //         this.theirDataArray.push(this.fillTheirData(value, this.detailLogsMap.get(value.bet_id)));
            //         this.allBetLogs.splice(i,1);
            //         let result = this.detailLogsMap.delete(value.bet_id);
            //         console.log("SBO: detailLogsMap delete:"+value.bet_id+" "+result+",length:"+this.detailLogsMap.size);
            //     }
            // }

            this.allBetLogsMap.forEach((value, key, map) =>{
                if(this.detailLogsMap.has(key)) {
                    this.theirDataArray.push(this.fillTheirData(value, this.detailLogsMap.get(key)));
                    map.delete(key);
                    if(this.detailLogsMap.has(key)) {
                        // console.log("SBO: detailLogsMap delete:"+key+", type:"+this.detailLogsMap.get(key).status+",length:"+this.detailLogsMap.size);
                        this.detailLogsMap.delete(key);
                    }
                }
            });
        }

        // console.log("SBO: theirDataArray size:"+this.theirDataArray.length);

        if(this.theirDataArray.length > 0) {
            this.service.Save(this.theirDataArray);
            this.theirDataArray = [];
        }
        // } else if() {

        // }
    }

    /**
     * 取得注單
     * @param start 注單開始時間
     */
    private async getBetData(start: number) {
        let allBetData = await this.service.GetTheirAllBetData(start);
        if (allBetData.length == 0) return 0;
        //console.log("betdata:"+allBetData);

        var res_allBetData = <IResAllBetData>JSON.parse(allBetData);
        if(res_allBetData.data == null || res_allBetData.data.action_result != "Success") {
            console.log("SBO: get bet data error:"+res_allBetData.error.code+"=>"+res_allBetData.error.message);
            return 0;
        }

        //console.log("all bet:"+allBetData);
        if (res_allBetData.data.betlogs.length == 0 && this.tmpBetLogs.length == 0) {
            console.log("SBO: no data");
            return 0;
        }

        if(res_allBetData.data.action_result == "Success" && res_allBetData.data.betlogs.length > 0) {
            this.tmpBetLogs = this.tmpBetLogs.concat(res_allBetData.data.betlogs);
        }

        let lasttime = 0;
        //取到直到最後一筆沒單為止
        if(res_allBetData.data.last_record_time) {
            lasttime = parseInt(res_allBetData.data.last_record_time);
            //console.log("last_record_time:"+lasttime);
            this.lastBetUpdateTime = lasttime;
        }

        if(lasttime == 0) {
            for(let i = 0; i < this.tmpBetLogs.length; i++) {
                let value = this.tmpBetLogs[i];
                // console.log("SBO: tmpBetLogs key:"+value.bet_id+",type:"+value.trans_type);
                if(value.trans_type == "Stake") {   //get bet_amount from stake data，投注
                    this.stakeBetIdMap.set(value.bet_id, value);
                } else if(value.trans_type == "Payoff") { //set bet_amount from stake to payoff data，派彩
                    if(this.stakeBetIdMap.has(value.bet_id)) { //只寫已派彩單
                        value.bet_amount = this.stakeBetIdMap.get(value.bet_id).bet_amount;
                        value.stake_at = this.stakeBetIdMap.get(value.bet_id).created_at;
                        this.allBetLogsMap.set(value.bet_id, value);
                    }
                // } else if(value.trans_type == "Payoff") { //set bet_amount from stake to payoff data，派彩
                //     if(this.stakeBetIdMap.has(value.bet_id)) { //只寫已派彩單
                //         value.bet_amount = this.stakeBetIdMap.get(value.bet_id).bet_amount;
                //         value.stake_at = this.stakeBetIdMap.get(value.bet_id).created_at;
                //         this.allBetLogsMap.set(value.bet_id, value);
                //     }
                }
            }
            this.tmpBetLogs = [];
        }

        return lasttime;
    }

    /**
     * 取得細單
     * @param start 細單開始時間
     */
    private async getDetailData(start: number) {
        let allDetailData = await this.service.GetTheirDetailBetData(start);
        if (allDetailData.length == 0) return 0;
        //console.log("detailbetdata:"+allDetailData);

        var res_allDetailData = <IResAllDetailData>JSON.parse(allDetailData);
        if(res_allDetailData.data == null || res_allDetailData.data.action_result != "Success") {
            console.log("SBO: get detail data error:"+res_allDetailData.error.code+"=>"+res_allDetailData.error.message);
            return 0;
        }

        // console.log("detail bet:"+allDetailData);

        if (res_allDetailData.data.betlogs.length == 0) {
            console.log("SBO: no detail data");
            return 0;
        }

        if(res_allDetailData.data.last_record_time) {
            this.lastDetailUpdateTime = parseInt(res_allDetailData.data.last_record_time);
            console.log("lastDetailUpdateTime:"+this.lastDetailUpdateTime);
        }

        res_allDetailData.data.betlogs.forEach((value) => {
            //細單會有running, draw等多筆狀態，不判斷狀態由最後一筆覆蓋之前
            //todo: 先全寫不確定狀態，後面的結果會覆蓋前面的

            //if(status.indexOf(value.status.toLowerCase()) != -1) {
            // console.log("SBO: detailLogsMap set:"+value.bet_id);
            this.detailLogsMap.set(value.bet_id, value);
            //}
        });

        return parseInt(res_allDetailData.data.last_record_time);
    }

    private fillTheirData(betData: IResBetLogs, detailData: IResDetailBetLogs): ResTheirData {
        var theirData: ResTheirData = new ResTheirData();
        theirData.player_name = betData.player_name;
        theirData.parent_bet_id = betData.parent_bet_id;
        theirData.bet_id = betData.bet_id;
        theirData.trans_type = betData.trans_type;
        theirData.game_code = betData.game_code;
        theirData.currency = betData.currency;
        theirData.bet_amount = betData.bet_amount;
        theirData.turn_over = detailData.turnover;
        theirData.win_amount = betData.win_amount;
        theirData.vendor_code = betData.vendor_code;
        theirData.wallet_code = betData.wallet_code;
        theirData.created_at = betData.stake_at;
        theirData.traceId = betData.traceId;
        theirData.orderTime = betData.stake_at;
        theirData.winlostDate  = betData.created_at;
        theirData.modifyDate = detailData.modifyDate;
        theirData.odds = detailData.odds;
        theirData.subBet = detailData.subBet;

        return theirData;
    }

    // for local exe call ( 固定排程 )
  @Get('CallBySchedule/:startBet,:startDetail')
  public async CallBySchedule(@Req() req, @Param() date) {
    //if(req.ip != "::ffff:127.0.0.1") return false ; // 鎖本地 IP
    console.log("SBO: schedule:", date );

    let betTime = 0, detailTime = 0;
    if(date.startBet != "0") {
        betTime = parseInt(moment(date.startBet, "YYYY-MM-DD HH:mm:ss.SSS").format("x"));
        console.log("SBO: parse bet date "+ date.startBet + " to "+betTime);
    }

    if(date.startDetail != "0") {
        detailTime = parseInt(moment(date.startDetail, "YYYY-MM-DD HH:mm:ss.SSS").format("x"));
        console.log("SBO: parse detail date "+ date.startDetail + " to "+detailTime);
    }
    this.start(betTime, detailTime) ;  // 待思考請求，當過多 await 是不是造成 API 伺服器出錯
    return [date.startBet, date.startDetail];
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
