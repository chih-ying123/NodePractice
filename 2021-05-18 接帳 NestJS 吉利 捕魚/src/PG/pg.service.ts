import { Injectable } from '@nestjs/common';
import { Common } from '../util/Common';
import * as moment from 'moment';
import * as fetch from 'node-fetch';
import { IEnv } from './env.interface';
import { Config, Dial, Loader, Log } from 'src/util';


@Injectable()
export class PgService {

    private env: IEnv;
    constructor() {
        this.env = Loader.GetENV<IEnv>("./public/PG/env.json");
    } 

    public async getBetData(startTime, endTime){

        let result = await this.callAPI(startTime, endTime);

        return result;
    };

    public async callAPI(from_time, to_time) {

        return new Promise(async (resolve, reject) => {

            let postBody = {
                operator_token: this.env.operator_token
                , secret_key: this.env.secret_key
                , count: 1500
                , bet_type: 1
                , from_time: 0
                , to_time: 0
            };
            
            postBody.from_time = moment(from_time,this.env.timeFormat).unix()*1000; //moment可以將時間轉為unix時間
            postBody.to_time = moment(to_time,this.env.timeFormat).unix()*1000;
            
            let postBodyArray = [];
            
            for(let key in postBody){
                postBodyArray.push(`${key}=${postBody[key]}`);
            }
            let postBodyStr = postBodyArray.join('&');
    
            let fetchOptions = {
                headers: {'content-Type':'application/x-www-form-urlencoded'}
                , method: 'post'
                , body: postBodyStr
            };
            try {
                let response = await fetch(`${this.env.apiDomain}/${this.env.api}`, fetchOptions);
                let jsonData = await response.json();
                resolve (jsonData);
            }
            catch (err) {
                reject(err);
            }
        });
    };

}
