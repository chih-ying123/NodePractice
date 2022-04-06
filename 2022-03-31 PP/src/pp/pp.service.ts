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
           console.log(apiResponse);
           
            let apiResponseArr = apiResponse.split("\n"); //將每筆資料以\n分開
            //console.log(apiResponseArr);
            let dataName = apiResponseArr[1].split(","); //從陣列第二項取得欄位名稱

            let dataList = []
            if (apiResponseArr.length>3){ //資料長度大於3才有資料
                for (let i=2; i<apiResponseArr.length-1; i++){  // 資料長度減1, 因為最後有一個空資料
                    let dateSplit = apiResponseArr[i].split(","); //每筆資料細項由逗號隔開
                    
                    let dataObj = {};
                    for (let x=0; x<dataName.length; x++){

                        let fieldName = dataName[x];
                        if ('roundDetails' === fieldName && '""'===dateSplit[x])
                        {
                            dateSplit[x] = ''
                        }


                        dataObj[dataName[x]] = dateSplit[x]; //將value對應的名稱存入dataObj中
                    }
                    dataList.push(dataObj); //所有資料存入dataList
                };
            };
            //console.log(dataList);
            this.SaveDataIntoDB(dataList);
            

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
    


    public async SaveDataIntoDB(datas: IbetDetails[]){

        if (this.conn == null) {
            this.conn = await Dial.GetSQLConn(Config.DB);
            if (this.conn == null) {
                return;
            }
        }

        for(let i=0; i< datas.length; i++){
            let data = datas[i];
            let winlose = data.win - data.bet; 
            let cmd = (`call NSP_BetData_Insert_PP(
                    ${data.playerID}
                    , '${data.extPlayerID}'
                    , '${data.gameID}'
                    , ${data.playSessionID}
                    , ${data.parentSessionID}
                    , '${data.startDate}'
                    , '${data.endDate}'
                    , '${data.status}'
                    , '${data.type}'
                    , ${data.bet}
                    , ${data.win}
                    , '${data.currency}'
                    , ${data.jackpot}
                    , '${data.roundDetails}'
                    , ${winlose}
                );`
            );  

            try{                 
                await this.conn.query(cmd);
            }
            catch(err){
                await this.WriteToFile(err) ;
                continue;
            }
        }
    }

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

            //console.log(`${GetBetListURL}?${postBodyStr}`);
            
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
