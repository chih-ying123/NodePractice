import { Injectable } from '@nestjs/common';
import { Common } from '../util/Common'
import * as moment from 'moment';
import * as fetch from 'node-fetch';
import { IEnv } from './Env.interface'; // 這是設定檔
import { Config, Dial, Loader, Log } from 'src/util';
import { v1 as uuidV1 } from 'uuid';


@Injectable()
export class JiLiFishingServiceService {

    private env: IEnv;
     constructor() {
        this.env = Loader.GetENV<IEnv>("./public/jiliFishing/env.json");
    }

    public generateKey(startDateTime, endDateTime, pageIndex, pageSize) {
        //最後驗證小透寫這行是對的, 一定是文件哪邊讓我誤解了
        let now = moment().utc().subtract(4, "h").format("GGMMD");
        let keyG = Common.MD5(`${now}${this.env.API_AgentId}${this.env.API_SECRET_KEY}`);
        let queryString = `StartTime=${startDateTime}&EndTime=${endDateTime}&Page=${pageIndex}&PageLimit=${pageSize}&AgentId=${this.env.API_AgentId}`;
        let md5string = Common.MD5(`${queryString}${keyG}`);
        let randomText1 = uuidV1().replace(/-/g, '').substr(6, 6);
        let randomText2 = uuidV1().replace(/-/g, '').substr(6, 6);    
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

    // 煩死 時間要加T '2020-09-02T00:00:00';
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
