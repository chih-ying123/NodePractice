import { Injectable } from '@nestjs/common';
import { Config, Dial, Loader, Log } from 'src/util';
import fetch from 'node-fetch';
import { Connection } from 'typeorm';
import { IEnv, IbetDetails } from './env.interface';



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

     public async getBetData(startTime, endTime, dataType){
        try{
            let apiResponse = await this.callAPI(startTime, endTime, dataType);
           
            let apiResponseArr = apiResponse.split("\n");
            console.log(apiResponseArr);
            let dataName = apiResponseArr[1].split(",");

            let dataList = []
            
            if (apiResponseArr.length>3){
                for (let i=2;i<apiResponseArr.length-1;i++){
                    let dateSplit = apiResponseArr[i].split(",");
                    let datagood = {};
                    for (let x=0;x<dataName.length;x++){
                        datagood[dataName[x]] =dateSplit[x];

                    }
                    dataList.push(datagood);
                    
                };
            };
            
            console.log(dataList);
            
            
            return dataList;
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

    public callAPI(startTime, endTime, dataType ):Promise<string>{

        return new Promise(async (resolve, reject) => {
            
            let timepoint = new Date(startTime).valueOf()
            
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
