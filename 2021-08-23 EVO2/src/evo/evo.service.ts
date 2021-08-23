import { Injectable, Logger } from '@nestjs/common';
import { Config, Dial, Loader, Log } from 'src/util';
import { IEnv } from './env.interface';
import fetch from 'node-fetch';
import {IAPIResponse, IEVOBetDataForDB} from './env.interface';
import { Connection } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class EvoService {

    private env: IEnv;
    constructor() {
        this.env = Loader.GetENV<IEnv>("./public/Evo/env.json")
    }
    private conn: Connection;


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
                    
                    let{id, startedAt, settledAt, status, gameType, participants, result} = game;  // 從game中取出屬性                    

                    for(let k=0; k< participants.length; k++){

                        let participant = participants[k];
                        let {playerId, bets} = participant;

                        for(let l = 0; l<bets.length; l++){
                            let bet = bets[l];
                            let {description, stake, payout, code, transactionId} = bet;
                            let evoBetData = new IEVOBetDataForDB();
                            evoBetData.id = id;
                            evoBetData.startedAt = startedAt;
                            evoBetData.settledAt = settledAt;
                            evoBetData.status = status;
                            evoBetData.gameType = gameType;
                            evoBetData.playerId = playerId;
                            evoBetData.bet = description;
                            evoBetData.stake = stake;
                            evoBetData.payout = payout;
                            evoBetData.winlose = payout - stake;
			                evoBetData.betid = code + transactionId;
			                evoBetData.code = code;
                            evoBetData.transactionId = transactionId;
                            evoBetData.result = JSON.stringify(result);
                            
                            datas.push(evoBetData);
                        }
                    }
                }
            }

            apiResponse["evoBetData"] = datas;  // todo:把datas資料寫進db
            this.SaveDataIntoDB(datas);

            return apiResponse;
        }
        catch(err){
            console.log(err.message);            
            return {
                errorMessage:'調用第三方api失敗'
                ,error:err.message
            }            
        }
        
    }

    public async SaveDataIntoDB(datas:IEVOBetDataForDB[]){

        //conn 連接資料庫
        if (this.conn == null) {
            this.conn = await Dial.GetSQLConn(Config.DB);
            if (this.conn == null) {
               
                return
            }
        }
        
        for(let i=0; i< datas.length; i++){
            let data = datas[i];
            let startedAt = data.startedAt.replace('T', ' ').replace('Z', '');
            let settledAt = data.settledAt.replace('T', ' ').replace('Z', '');           
           
            let cmd = `
                call NSP_BetData_Insert_EVO(                
                      '${data.id}'
                    , '${startedAt}'
                    , '${settledAt}'
                    , '${data.status}'
                    , '${data.gameType}'
                    , '${data.playerId}'
                    , '${data.bet.replace('\'', '\\\'')}'
                    ,  ${data.stake} 
                    ,  ${data.payout}
                    ,  ${data.winlose}
		            , '${data.betid}'
		            , '${data.code}'
                    ,  ${data.transactionId}
                    , '${data.result}'
                );`
            ;          

		   // fs.appendFile('./EvoSQL.sql', cmd+"\n", 'utf8', err => { }); 

            try{                
                
                this.conn.query(cmd);
                
            }   
            catch(err){
                
                console.log(cmd);
                continue; //繼續往下一筆執行
                
            }
        }

        
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
