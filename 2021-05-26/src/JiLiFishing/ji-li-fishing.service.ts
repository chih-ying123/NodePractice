import { Injectable } from '@nestjs/common';
import * as moment from 'moment';
import { Config, Dial, Loader, Log } from 'src/util';
import { IEnv } from './Env.interface';
import { v1 as uuidV1 } from 'uuid';
import { Common } from '../util/Common';
import * as fetch from 'node-fetch';
import { IResponse } from './res.interface';
import { Result } from 'src/jili/model/res.interface';

@Injectable()
export class JiLiFishingService {

    private env: IEnv;
    constructor() {
        this.env = Loader.GetENV<IEnv>("./public/JiLiFishing/env.json");
    }

    public generateKey(startDateTime, endDateTime, pageIndex, pageSize) {
        
        let now = moment().utc().subtract(4, "h").format("GGMMD");
        let keyG = Common.MD5(`${now}${this.env.API_AgentId}${this.env.API_SECRET_KEY}`);
        let queryString = `StartTime=${startDateTime}&EndTime=${endDateTime}&Page=${pageIndex}&PageLimit=${pageSize}&AgentId=${this.env.API_AgentId}`;
        let md5string = Common.MD5(`${queryString}${keyG}`);
        let randomText1 = uuidV1().replace(/-/g, '').substr(6, 6);
        let randomText2 = uuidV1().replace(/-/g, '').substr(6, 6);
    
        console.log(randomText1, randomText2);
        let key = randomText1 + md5string + randomText2;
        return key;
    }

    public async SaveDataIntoDB(datas:Array<Result>):Promise<void>{

        //痴yinG寫: 去抄小透的

    }

    public async getBetData(startDateTime, endDateTime, pageIndex, pageSize):Promise<IResponse| IResponse[] > {

        let apiResponse = await this.callAPI(startDateTime, endDateTime, pageIndex, pageSize);
       
        if (apiResponse.ErrorCode === '0')// API調用成功狀態
        {
            this.SaveDataIntoDB(apiResponse.Data.Result) ;  // 把資料回寫到資料庫中           
            
            //分頁處理
             let totalPages = apiResponse.Data.Pagination.TotalPages;
            if(pageIndex === 1 && totalPages > 1) {// 當前頁次為1，並且有其它頁需要再調用api
                
                let result = [];
                result.push(apiResponse);//保存第一頁調用結果
                for(let i=2; i<=totalPages; i++) // 由第2頁開始往後逐頁讀取
                {
                    let nextAPIResponse = await this.callAPI(startDateTime, endDateTime, i, pageSize);
                    result.push(nextAPIResponse); 
                    this.SaveDataIntoDB(nextAPIResponse.Data.Result) ;  // 把資料回寫到資料庫中
                    
                }
                return result;
            }
        }

        return apiResponse;
    }

    public callAPI(startDateTime, endDateTime, pageIndex, pageSize) {

        startDateTime = startDateTime.replace(' ', 'T');
        endDateTime = endDateTime.replace(' ', 'T');
        console.log(startDateTime, endDateTime);
    
        return new Promise<IResponse>(async (resolve, reject) => {
    
            let postBody = {
                "AgentId": this.env.API_AgentId,
                "Key": this.generateKey(startDateTime, endDateTime, pageIndex, pageSize),
                "StartTime": startDateTime,
                "EndTime": endDateTime,
                "Page": pageIndex,
                "PageLimit": pageSize,
                "GameId": "",
                "FilterAgent": "1"
            }
    
            let postBodyArray = [];
            for (let key in postBody) {
                postBodyArray.push(`${key}=${postBody[key]}`);
            }
            let postBodyStr = postBodyArray.join('&');
            console.log(postBodyStr);
            
    
            let url = `${this.env.API_URI}GetFishBetRecordByTime`;
    
            let fetchOptions = {
                'method': 'POST',
                'headers': {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: postBodyStr
            }
            try {
                let res = await fetch(url, fetchOptions);
                let json = await res.json();
                
                resolve(json);
            }
            catch (err) {
                reject(err);
            }
        });
    }
}
