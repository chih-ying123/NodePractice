import { Injectable } from '@nestjs/common';
import { Config, Dial, Loader, Log } from 'src/util';
import fetch from 'node-fetch';
import { Connection } from 'typeorm';
import { IEnv, IbetDetails } from './env.interface';
import * as moment from 'moment';
import template from './pp.RoundDetails';

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
            let apiResponseArr = apiResponse.split("\n"); //將每筆資料以\n分開            
            let dataName = apiResponseArr[1].split(","); //從陣列第二項取得欄位名稱

            let dataList = []
            if (apiResponseArr.length>3){ //資料長度大於3才有資料
                for (let i=2; i<apiResponseArr.length-1; i++){  // 資料長度減1, 因為最後有一個空資料
                    let dateSplit = []
                    
                    if (dataType === 'LC') 
                    {
                        let splitCount = dataName.length-1; 
                
                        dateSplit = apiResponseArr[i].split(",", splitCount); //roundDetails前的每筆欄位細項由逗號隔開
                        let search = apiResponseArr[i].match('\"');
                        let roundDetails = ''; 
                        if (search){
                            roundDetails = apiResponseArr[i].slice(search.index);
                        }
                        dateSplit.push(roundDetails);
                    }
                    if (dataType === 'RNG') 
                    {
                        dateSplit = apiResponseArr[i].split(",");
                    }

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
            this.SaveDataIntoDB(dataList, dataType);
            
            //return apiResponse;
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
    
    public async SaveDataIntoDB(datas: IbetDetails[], dataType){

        if (this.conn == null) {
            this.conn = await Dial.GetSQLConn(Config.DB);
            if (this.conn == null) {
                return;
            }
        }
        
        let GameType = 0
        let FanShuiType = '';
        
        if (dataType === 'LC') 
        {
            GameType = 5 ;
            FanShuiType = 'V'
        }
        else if (dataType === 'RNG') 
        {
            GameType = 2 ;
            FanShuiType = 'E'
        }

        let roundDetails = '';
        let roundDetailsFromPP = '';
        
        for(let i=0; i< datas.length; i++){
            let data = datas[i];
            
            if (data.roundDetails) {
                roundDetailsFromPP = data.roundDetails; //把原本PP的roundDetails存入roundDetailsFromPP
                roundDetails = this.getRoundDetails(data.gameID, data.roundDetails);
            }; 
            let startDate = data.startDate;
            let endDate = data.endDate;
            if (dataType === 'RNG') 
            {   /* 電子後台資料時間是+8時區, 存入資料庫+8小時 
                (API調用時間為+0時區, 真人後台資料同+0時區不做更動) */
                startDate =  moment(startDate).add(+8,'hour').format('YYYY-MM-DD HH:mm:ss');
                endDate =  moment(endDate).add(+8,'hour').format('YYYY-MM-DD HH:mm:ss');
            }

            let winlose = data.win - data.bet; 
            let cmd = (`call NSP_BetData_Insert_PP(
                    ${data.playerID}
                    , '${data.extPlayerID}'
                    , '${data.gameID}'
                    , ${data.playSessionID}
                    , ${data.parentSessionID}
                    , '${startDate}'
                    , '${endDate}'
                    , '${data.status}'
                    , '${data.type}'
                    , ${data.bet}
                    , ${data.win}
                    , '${data.currency}'
                    , ${data.jackpot}
                    , '${roundDetails}'
                    , ${winlose}
                    , ${GameType}
                    , '${FanShuiType}'
                    , '${roundDetailsFromPP.replace('\\\"','\"')}'
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


    public getRoundDetails(gameID, roundDetails){
        let data = roundDetails.replace(/"/g,"'");
        let data2 = data.replace(/''/g,'"');
        let data3 = data2.replace(/'/g,'');

        let jsondata = JSON.parse(data3);
        let roundDetail = '';

        if (typeof template[gameID] === 'function'){
            roundDetail = template[gameID](jsondata);
            //console.log(roundDetail);
            
        }

        return roundDetail
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
                //console.log(jsonData);
                
                resolve(jsonData);
            }
            catch (err) {
                reject(err);
            }
        });
    }
}
