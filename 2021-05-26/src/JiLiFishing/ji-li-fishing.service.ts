import { Injectable } from '@nestjs/common';
import * as moment from 'moment';
import { Config, Dial, Loader, Log } from 'src/util';
import { IEnv } from './Env.interface';
import { v1 as uuidV1 } from 'uuid';
import { Common } from '../util/Common';
import * as fetch from 'node-fetch';

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

    public async getBetData(startDateTime, endDateTime, pageIndex, pageSize) {

        let result = await this.callAPI(startDateTime, endDateTime, pageIndex, pageSize);
    
        // todo : 例外處理
        // 分頁處理
        // 把資料回寫到資料庫中
        return result;
    }

    public callAPI(startDateTime, endDateTime, pageIndex, pageSize) {

        startDateTime = startDateTime.replace(' ', 'T');
        endDateTime = endDateTime.replace(' ', 'T');
        console.log(startDateTime, endDateTime);
    
        return new Promise(async (resolve, reject) => {
    
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
