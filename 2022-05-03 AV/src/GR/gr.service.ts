import { Injectable } from '@nestjs/common';
import { Config, Dial, Loader, Log } from 'src/util';
import fetch from 'node-fetch';
import { Connection } from 'typeorm';
import { IEnv, IAPIResponse, IbetDetails } from './env.interface';

@Injectable()
export class GRService {

    private env: IEnv;
    constructor() {
        this.env = Loader.GetENV<IEnv>("./public/gr/env.json");
    }
    private conn: Connection;

    public WriteToFile(data: any) {
        Log.WriteToFile("GR", data);
    }

    public async getBetData(startTime, endTime, currentPage){

        try{
            let apiResponse = await this.callAPI(startTime, endTime, currentPage);
            //console.log(apiResponse);
            let { status, code, message, data } = apiResponse;
            let { bet_details, total_pages } = data;
            if ( status === "Y" &&  bet_details!== null){
                this.SaveDataIntoDB(bet_details);
                if(total_pages > 1) {
                
                    let result = [];
                    result.push(apiResponse);
                    for(let i=2; i<=total_pages; i++)
                    {
                        let nextAPIResponse = await this.callAPI(startTime, endTime, i);                    
                        if (nextAPIResponse.status === "Y" &&  nextAPIResponse.data.bet_details!== null)
                        {
                            result.push(nextAPIResponse);
                            this.SaveDataIntoDB(nextAPIResponse.data.bet_details);
                        }
                    }
                    console.log(result);
                    
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


    public async SaveDataIntoDB(datas: IbetDetails[]){

        if (this.conn == null) {
            this.conn = await Dial.GetSQLConn(Config.DB);
            if (this.conn == null) {
                return;
            }
        }
        
        for(let i=0; i< datas.length; i++){
            let data = datas[i];
            let create_time = data.create_time.replace("T", " ").replace("-04:00", "");



            let cmd = (`call NSP_BetData_Insert_GR(
                    ${data.id}
                    , '${data.sid}'
                    , '${data.account.replace("@tw", "")}'
                    , ${data.game_type}
                    , ${data.game_round}
                    , ${data.bet}
                    , '${data.game_result}'
                    , ${data.valid_bet}
                    , ${data.win}
                    , '${create_time}'
                    , '${data.order_id}'
                    , '${data.device}'
                    , '${data.client_ip}'
                    , '${data.c_type}'
                    , ${data.profit}
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

    public async callAPI(startTime, endTime, currentPage ):Promise<IAPIResponse>{

        return new Promise(async (resolve, reject) => {

            let { baseURI, getSlotBetAPI, secret_key } = this.env;

            let postBody = {
                'start_time': startTime.replace(" ", "T")+'-04:00',
                'end_time': endTime.replace(" ", "T")+'-04:00',
                'page_index': currentPage,
                'page_size': 500
            }
        
            let myHeaders = {
               'Content-Type': 'application/json'
                , 'Cookie': `secret_key=${secret_key}`
            }
       
            let fetchOptions = {
                method: 'POST'
                , headers: myHeaders
                , body: JSON.stringify(postBody)
            }
            let GetBetListURL = `${baseURI}/${getSlotBetAPI}`;
        
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
