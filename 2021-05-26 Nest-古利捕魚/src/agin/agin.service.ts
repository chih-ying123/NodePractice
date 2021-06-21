import { Injectable, Logger } from '@nestjs/common';

import { Config, Dial, Loader, Log } from 'src/util';
import { IEnv } from './model/Env.interface';
import * as request from 'request';
import { Common } from '../util/Common'
import * as moment from 'moment';
import * as qs from 'qs';
import { IBetData } from './model/IBetdata';

@Injectable()
export class AginService {
    constructor() {
        this.env = Loader.GetENV<IEnv>("./public/AGIN/env.json");
    }

    private env: IEnv;

    // WriteToFile 加入 log 檔寫入
    public WriteToFile(data:any){
        Log.WriteToFile("agin", data) ;
    }

    public async saveDataIntoDB(betDatas: IBetData[]) {
        var conn = await Dial.GetSQLConn(Config.DB);
        if (conn == null) {
            Logger.debug("[AginService:saveDataIntoDB:conn]error") ;
            this.WriteToFile("[AginService:saveDataIntoDB:conn]error");
            return;
        }

        for (let x of betDatas) {
            var cmd = `CALL NSP_BetData_AGIN_Single_Wallet_Video_Insert(
                ${x.billNo}
                , '${x.playName}'
                , '${x.gameCode}'
                , ${x.netAmount}
                , '${x.betTime}'
                , '${x.gameType}'
                , ${x.betAmount}
                , ${x.validBetAmount}
                , ${x.flag}
                , ${x.playType}
                , '${x.currency}'
                , '${x.tableCode}'
                , '${x.recalcuTime}'
                , ${x.beforeCredit}
                , '${x.betIP}'
                , '${x.platformType}'
                , '${x.remark}'
                , '${x.round}'
                , '${x.result}'
                , '${x.deviceType}'
                , N''              
            );`
            await conn.query(cmd).catch(e => {
                Logger.debug(e, "AginService")
                this.WriteToFile(e);
                this.WriteToFile(cmd);
            });
        }
        conn.close();
    }

    public generateAPIRequest(dateTimeList: Array<{ start: string, end: string }>, pageIndex: number, pageSize: number) {
        pageIndex = pageIndex || 1;
        pageSize = pageSize || 500;
        let cagent = this.env.cagent;
        let apiRequest = [];
        dateTimeList.forEach((dateTimeObj) => {

            let key = this.generateKey(dateTimeObj.start, dateTimeObj.end, pageIndex, pageSize)
            apiRequest.push(`${this.env.url}/getorders.xml?cagent=${cagent}&startdate=${dateTimeObj.start}&enddate=${dateTimeObj.end}&page=${pageIndex}&perpage=${pageSize}&key=${key}`);

        })
        return apiRequest
    }

    public generateKey(startDateTime, endDateTime, pageIndex, pageSize) {
        let cagent = this.env.cagent;
        let code = this.env.code;
        let key = Common.MD5(`${cagent}${startDateTime}${endDateTime}${pageIndex}${pageSize}${code}`);
        return key;
    }

    //抓取agin xml中的row裡面指定的屬性值
    public getRowProperty(row, propertyName) {
        let reg = new RegExp(`${propertyName}="(.*?)"`);
        let pro = row.match(reg);
        return pro[1];
    }

    // 這XML好煩....
    public async processXML(url: string, xml: string, next: boolean) {

        let totalpage = Number(/<totalpage>(\d+)<\/totalpage>/.exec(xml)[1]);
        let cagent = this.env.cagent;

        let reg = /<row([\s\S]+?)\/>/g;
        let rows = [];
        let betDatas: Array<IBetData> = [];
        while ((rows = reg.exec(xml)) !== null) {
            let row = rows[0];
            let betData: IBetData = {
                billNo: this.getRowProperty(row, 'billNo')
                , playName: this.getRowProperty(row, 'playName')
                , gameCode: this.getRowProperty(row, 'gameCode')
                , netAmount: this.getRowProperty(row, 'netAmount')
                , betTime: this.getRowProperty(row, 'betTime')
                , betAmount: this.getRowProperty(row, 'betAmount')
                , validBetAmount: this.getRowProperty(row, 'validBetAmount')
                , flag: this.getRowProperty(row, 'flag')
                , playType: this.getRowProperty(row, 'playType')
                , currency: this.getRowProperty(row, 'currency')
                , tableCode: this.getRowProperty(row, 'tableCode')
                , recalcuTime: this.getRowProperty(row, 'recalcuTime')
                , beforeCredit: this.getRowProperty(row, 'beforeCredit')
                , betIP: this.getRowProperty(row, 'betIP')
                , platformType: this.getRowProperty(row, 'platformType')
                , remark: this.getRowProperty(row, 'remark')
                , round: this.getRowProperty(row, 'round')
                , result: this.getRowProperty(row, 'result')
                , gameType: this.getRowProperty(row, 'gameType')
                , deviceType: this.getRowProperty(row, 'deviceType')
            }
            betDatas.push(betData)
        }

        this.saveDataIntoDB(betDatas);

        //需要處理分頁
        for (let page = 2; page <= totalpage && next; page++) {

            let queryObj = qs.parse(url.split('?')[1]);
            let { startdate, enddate, perpage } = queryObj;
            let key = this.generateKey(startdate, enddate, page, perpage)
            let nextUrl = `${this.env.url}/getorders.xml?cagent=${cagent}&startdate=${startdate}&enddate=${enddate}&page=${page}&perpage=${perpage}&key=${key}`
            let nextXML = await this.getXML(nextUrl);
            if (nextXML === '') continue;
            this.processXML(url, nextXML, false); // 
        }
    }

    public getXML(url): Promise<string> {
        return new Promise((resolve, reject) => {
            request(url, (error, response, body)=>{
                if (error) {
                    this.WriteToFile("AginService[getXML]error")
                    this.WriteToFile(error) ;
                    Logger.log(error, "AginService[getXML]");

                    return resolve("");
                }
                resolve(body);
            });
        });
    }

    public generateDateTimeList(date: string): Array<{ start: string, end: string }> {

        let list;

        if (date == null || date === '') {

            // 取昨日
            let yesterday = moment().subtract(1, 'days').format('YYYY-MM-DD');
            // 取今日
            let today = moment().format('YYYY-MM-DD');
            // 合併2個陣列
            let yesterdayList = Common.dateSplitByMin(yesterday, 10);
            let todayList = Common.dateSplitByMin(today, 10);
            list = yesterdayList.concat(todayList);
        }
        else {
            if (/\d\d\d\d-\d\d-\d\d/.test(date) == false) {
                throw new TypeError('錯誤的日期')
            }
            list = Common.dateSplitByMin(date, 10);
        }
        return list;

    }

}
