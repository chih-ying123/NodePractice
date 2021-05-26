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

    public async getBetData(startDateTime, endDateTime, pageIndex, pageSize):Promise<IResponse | IResponse[] > {

        let apiResponse = await this.callAPI(startDateTime, endDateTime, pageIndex, pageSize);
       
        if (apiResponse.ErrorCode === '0')// API調用成功狀態，請參考文件
        {
            this.SaveDataIntoDB(apiResponse.Data.Result) ;  // 把資料回寫到資料庫中           
            
            //分頁處理
            let totalPages = apiResponse.Data.Pagination.TotalPages;
            if(totalPages > 1) {// 有其它頁需要再調用api
                
                let result = [];
                result.push(apiResponse);//保存第一頁調用結果
                for(let i=2; i<=totalPages; i++) // 由第2頁開始往後逐頁讀取
                {
                    let nextAPIResponse = await this.callAPI(startDateTime, endDateTime, i/*傳i進去*/, pageSize);                    
                    if (nextAPIResponse.ErrorCode === '0')
                    {
                        result.push(nextAPIResponse); 
                        this.SaveDataIntoDB(nextAPIResponse.Data.Result) ;  // 把資料回寫到資料庫中
                    }                    
                }
                return result; // 有多頁就回傳一個陣列
            }
        }
        return apiResponse; // 只有一頁就回傳一個物件
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
            console.log('嚶嚶嚶 嚶嚶嚶 ---------------------愛哭的分隔線');
            
    
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
