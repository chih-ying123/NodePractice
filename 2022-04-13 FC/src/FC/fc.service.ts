import { Injectable, Logger } from '@nestjs/common';
import { Config, Dial, Loader, Log, Common } from 'src/util';
import { IEnv, IAPIResponse, IRecords } from './env.interface';
import fetch from 'node-fetch';
import { Connection } from 'typeorm';
import { URLSearchParams } from "url";

@Injectable()
export class FCService {

    private env: IEnv;
    constructor() {
        this.env = Loader.GetENV<IEnv>("./public/FC/env.json")
    }
    private conn: Connection;
    public WriteToFile(data: any) {
        Log.WriteToFile("Funky", data);
    }

    public async getBetData( startTime, endTime ){
        let apiResponse = await this.callAPI(startTime, endTime); 
            
            if (apiResponse.Result === 0){
                this.SaveDataIntoDB(apiResponse.Records) ;
            }
        return apiResponse;
    }
    public async SaveDataIntoDB( Records:IRecords[] ){
        
        if (this.conn == null) {
            this.conn = await Dial.GetSQLConn(Config.DB);
            if (this.conn == null) {
                return;
            }
        }

        for(let i=0; i< Records.length; i++){

            let data = Records[i];

            let cmd = (`call NSP_BetData_Insert_FC(
                      ${data.bet}
                    , ${data.prize}
                    , ${data.winlose}
                    , ${data.before}
                    , ${data.after}
                    , ${data.jptax}
                    , ${data.jppoints}
                    , ${data.recordID}
                    , '${data.account}'
                    , ${data.gameID}
                    , ${data.gametype}
                    , ${data.jpmode}
                    , '${data.bdate}'
                );`
            );  

            try{                 
                await this.conn.query(cmd);
            }
            catch(err){
                this.WriteToFile(err) ;
                continue;
            }
        }

    }

    public callAPI( startTime, endTime ):Promise<IAPIResponse>{
        
        return new Promise(async (resolve, reject) => {

            let { baseURI, getBetAPI, AgentCode, AgentKey, Currency } = this.env;

            let dataObject = {
                "StartDate": startTime,
                "EndDate": endTime
            }
            let dataString = JSON.stringify(dataObject);
            let iv =''

            let afterEncrypted = Common.encrypt(dataString, AgentKey, iv);
            let signMD5 = Common.MD5(dataString);
            //console.log( afterEncrypted);
            //console.log(signMD5);
            
            const params = new URLSearchParams();
            params.append('AgentCode', AgentCode);
            params.append('Currency', Currency);
            params.append('Params', afterEncrypted);
            params.append('Sign', signMD5);
      
            let fetchOptions = {
                method: 'POST'
                , headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                , body: params
            }
            let GetBetListURL = `${baseURI}${getBetAPI}`;
        
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
