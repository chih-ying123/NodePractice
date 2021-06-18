import { Injectable, Logger } from '@nestjs/common';
import { Config, Dial, Loader, Log } from 'src/util';
import { IEnv } from './env.interface';
import * as fetch from 'node-fetch';
import {APIResponse} from './env.interface'

@Injectable()
export class EvoService {

    private env: IEnv;
    constructor() {
        this.env = Loader.GetENV<IEnv>("./public/Evo/env.json")
    }

    public async getBetData(startDate, endDate){
        
        let apiResponse = await this.callAPI(startDate, endDate);

        console.log(apiResponse.data[0].games[0].id);
        console.log(apiResponse.data[0].games[0].participants[0].playerId);

        return apiResponse;
        
    }

    public callAPI(startDate, endDate):Promise<APIResponse>{
        startDate = startDate.replace(' ', 'T')+'Z';
        endDate = endDate.replace(' ', 'T')+'Z';
        //console.log(startDate, endDate);

        return new Promise(async (resolve, reject) => {

            let postBody = {
                "startDate": startDate,
                "endDate": endDate,
            }

            let postBodyArray = [];
            for (let key in postBody) {
                postBodyArray.push(`${key}=${postBody[key]}`);
            }
            let postBodyStr = postBodyArray.join('&');
            //console.log(postBodyStr);

            let gamehistoryURL = `${this.env.baseURI}${this.env.historyAPI}?${postBodyStr}`;
            let AuthorizationToken = Buffer.from(`${this.env.casinoId}:${this.env.gameHistoryApiToken}`).toString('base64')

            let fetchOptions = {
                method: 'GET',
                headers: {
                    'Authorization': `Basic ${AuthorizationToken}`
                }
            }
            try {
                let response = await fetch(gamehistoryURL, fetchOptions);
                let jsonData = await response.json();
                resolve(jsonData);
            }
            catch (err) {
                reject(err);
            }
        });
    }

}
