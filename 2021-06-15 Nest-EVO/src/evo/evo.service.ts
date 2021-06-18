import { Injectable, Logger } from '@nestjs/common';
import { Config, Dial, Loader, Log } from 'src/util';
import { IEnv } from './env.interface';
import * as fetch from 'node-fetch';
import {IAPIResponse, IEVOBetDataForDB} from './env.interface'

@Injectable()
export class EvoService {

    private env: IEnv;
    constructor() {
        this.env = Loader.GetENV<IEnv>("./public/Evo/env.json")
    }

    public async getBetData(startDate, endDate){
        
        try{
            let datas:IEVOBetDataForDB[] = [];
            let apiResponse = await this.callAPI(startDate, endDate);           

            // 把資料有陣列的地方，都用迴圈跑過
            for(let i=0; i< apiResponse.data.length; i++)
            {
                let data = apiResponse.data[i] ;
                let {games} = data; // 從data中取出game屬性 
                for(let j=0; j < games.length; j++) // data.games
                {  
                    let game = games[j];                   
                    
                    let{id, startedAt, settledAt, status, gameType, participants} = game;  // 從game中取出屬性                    

                    for(let k=0; k< participants.length; k++){

                        let participant = participants[k];
                        let {playerId, bets} = participant;

                        for(let l = 0; l<bets.length; l++){
                            let bet = bets[l];
                            let {stake, payout, transactionId} = bet;
                            let evoBetData = new IEVOBetDataForDB();
                            evoBetData.id = id;
                            evoBetData.startedAt = startedAt;
                            evoBetData.settledAt = settledAt;
                            evoBetData.status = status;
                            evoBetData.playerId = playerId;
                            evoBetData.stake = stake;
                            evoBetData.payout = payout;
                            evoBetData.winlose = payout - stake;
                            evoBetData.transactionId = transactionId;
                            datas.push(evoBetData);
                        }
                    }
                }
            }

            apiResponse["珍貴鼻子換來的"] = datas;  // todo:把datas資料寫進db
            console.log(apiResponse["珍貴鼻子換來的"][0]);
            console.log(apiResponse["珍貴鼻子換來的"][0].id);
            this.SaveDataIntoDB(apiResponse["珍貴鼻子換來的"]);

            return apiResponse;
        }
        catch(err){
            console.log(err);            
            return {
                errorMessage:'調用第三方api失敗'
                ,error:err.message
            }            
        }
        
    }

    public async SaveDataIntoDB(datas){
        console.log(datas);

        /*
        
        INSERT INTO \`BetData_EVO\`
        SET
            id = 
            , startedAt = 
            , settledAt = 
            , status = 
            , gameType = 
            , playerId = 
            , stake = 
            , payout = 
            , winlose = 
            , transactionId =  ;`
        );
        
        */
    }

    public callAPI(startDate, endDate):Promise<IAPIResponse>{
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
