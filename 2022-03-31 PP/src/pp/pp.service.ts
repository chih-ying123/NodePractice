import { Injectable } from '@nestjs/common';
import { Config, Dial, Loader, Log } from 'src/util';
import fetch from 'node-fetch';
import { Connection } from 'typeorm';
import { IEnv, IAPIResponse, IbetDetails } from './env.interface';

@Injectable()
export class PPService {

    private env: IEnv;
    constructor() {
        this.env = Loader.GetENV<IEnv>("./public/pp/env.json");
    }
    private conn: Connection;

    public WriteToFile(data: any) {
        Log.WriteToFile("PP", data);
    }

     public async getBetData(startTime, endTime){
        try{
            let LCapiResponse = await this.callAPI(startTime, endTime, 'LC'); //真人參數 LC
            let RNGapiResponse = await this.callAPI(startTime, endTime, 'RNG'); //電子參數 RNG
            
            console.log(RNGapiResponse);

            let data = {}
            data["LCapiResponse"] = LCapiResponse;
            data["RGNapiResponse"] = RNGapiResponse;

            return data;
        }
        catch(err){
            console.log(err);
            return {
                errorMessage:'調用第三方api失敗'
                ,error:err.message
            }            
        }
    }
    


    // public async SaveDataIntoDB(datas: IbetDetails[]){

    //     if (this.conn == null) {
    //         this.conn = await Dial.GetSQLConn(Config.DB);
    //         if (this.conn == null) {
    //             return;
    //         }
    //     }

    //     for(let i=0; i< datas.length; i++){
    //         let data = datas[i];

    //         let cmd = (`call NSP_BetData_Insert_GR(
    //                 ${data.id}
    //                 , '${data.sid}'
    //                 , '${data.account.replace("@tw", "")}'
    //                 , ${data.game_type}
    //                 , ${data.game_round}
    //                 , ${data.bet}
    //                 , '${data.game_result}'
    //             );`
    //         );  

    //         try{                 
    //             this.conn.query(cmd);
    //         }
    //         catch(err){
    //             this.WriteToFile(err) ;
    //             continue;
    //         }
    //     }
    // }

    public callAPI(startTime, endTime, dataType ):Promise<IAPIResponse>{

        return new Promise(async (resolve, reject) => {

            
            let timepoint = new Date(startTime).valueOf()
            console.log(timepoint);
            
            let { baseURI, getBetAPI, login, password } = this.env;

            let postBody = {
                "login": login
                , "password": password
                , "timepoint": timepoint
                , "dataType": dataType
                , "options": "addRoundDetails"
            }
            let postBodyArray = [];
            for (let key in postBody) {
                postBodyArray.push(`${key}=${postBody[key]}`);
            }
            let postBodyStr = postBodyArray.join('&');
       
            let GetBetListURL = `${baseURI}${getBetAPI}`;
            try {
                let response = await fetch(`${GetBetListURL}?${postBodyStr}`);
                let jsonData = await response.text();
                resolve(jsonData);
            }
            catch (err) {
                reject(err);
            }
        });
    }
}
