import { Injectable } from '@nestjs/common';
import { Config, Dial, Loader, Log } from 'src/util';
import fetch from 'node-fetch';
import { Connection } from 'typeorm';
import { IEnv, IAPIResponse, IData } from './env.interface';

@Injectable()
export class FunkyService {

    private env: IEnv;
    constructor() {
        this.env = Loader.GetENV<IEnv>("./public/funky/env.json");
    }
    private conn: Connection;

    public WriteToFile(data: any) {
        Log.WriteToFile("Funky", data);
    }

    public async getBetData(startTime, endTime, currentPage){
        try{
            let apiResponse = await this.callAPI(startTime, endTime, currentPage);
            //console.log(apiResponse);
            let { errorCode, totalPage, data } = apiResponse;
            if ( errorCode === 0 ){
                this.SaveDataIntoDB(data);
                if(totalPage > 1) {
                
                    let result = [];
                    result.push(apiResponse);
                    for(let i=2; i<=totalPage; i++)
                    {
                        let nextAPIResponse = await this.callAPI(startTime, endTime, i);                    
                        if (nextAPIResponse.errorCode === 0)
                        {
                            result.push(nextAPIResponse);
                            this.SaveDataIntoDB(nextAPIResponse.data);
                        }
                    }
                    return result;
                }
            }
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

    public async SaveDataIntoDB(datas: IData[]){

        if (this.conn == null) {
            this.conn = await Dial.GetSQLConn(Config.DB);
            if (this.conn == null) {
                return;
            }
        }

        for(let i=0; i< datas.length; i++){
            let data = datas[i];

            if (data.betStatus === 'R' || data.betStatus === 'C'){
                continue;
            }


            let cmd = (`call NSP_BetData_Insert_Funky(
                    '${data.playerId}'
                    , '${data.statementDate}'
                    , '${data.betTime}'
                    , '${data.refNo}'
                    , '${data.betStatus}'
                    , '${data.gameCode}'
                    , '${data.gameName.replace('\'', '\\\'')}'
                    , '${data.currency}'
                    , ${data.betAmount}
                    , ${data.effectiveStake}
                    , ${data.winLoss}
                );`
            );  

            try{                 
                this.conn.query(cmd);
            }
            catch(err){
                this.WriteToFile(err) ;
                continue;
            }
        }
    }

    public callAPI(startTime, endTime, currentPage):Promise<IAPIResponse>{

        return new Promise(async (resolve, reject) => {

            let { baseURI, getBetAPI, Authentication, UserAgent, XRequestID, currency } = this.env;

            let postBody = {
                'currency': currency,
                'startTime': startTime,
                'endTime': endTime,
                'page': currentPage
            }

            let myHeaders = {
               'Content-Type': 'application/json'
                , 'Authentication': Authentication
                , 'User-Agent': UserAgent
                , 'X-Request-ID': XRequestID
            }
       
            let fetchOptions = {
                method: 'POST'
                , headers: myHeaders
                , body: JSON.stringify(postBody)
            }
            let GetBetListURL = `${baseURI}/${getBetAPI}`;
        
            try {
                let response = await fetch(`${GetBetListURL}`, fetchOptions);
                let jsonData = await response.json();
                resolve(jsonData);
            }
            catch (err) {
                reject(err);
            }
        });
    }
}
