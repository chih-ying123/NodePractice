import { Injectable, Logger } from '@nestjs/common';
import { Config, Dial, Loader, Log, Common } from 'src/util';
import { IEnv, IAPIResponse, Ibetlog_result } from './env.interface';
import fetch from 'node-fetch';
import { Connection } from 'typeorm';
import * as jwt from 'jsonwebtoken'; //npm install jsonwebtoken

@Injectable()
export class MCService {

    private env: IEnv;
    constructor() {
        this.env = Loader.GetENV<IEnv>("./public/MC/env.json")
    }
    private conn: Connection;
    public WriteToFile(data: any) {
        Log.WriteToFile("MC", data);
    }

    public async getBetData( startTime, endTime ){
        let apiResponse = await this.callAPI(startTime, endTime);           
            if (apiResponse.status.code === 1){
                this.SaveDataIntoDB(apiResponse.data.betlog_result) ;
            }
        return apiResponse;
    }

    public async SaveDataIntoDB( datas:Ibetlog_result[] ){
        
        if (this.conn == null) {
            this.conn = await Dial.GetSQLConn(Config.DB);
            if (this.conn == null) {
                return;
            }
        }

        for(let i=0; i< datas.length; i++){
            
            let data = datas[i];
            let winlose = data.payoff - data.bet_valid
            let cmd = (`call NSP_BetData_Insert_MC(
                      '${data.bet_id}'       
                    , '${data.game_code}'
                    , '${data.game_name}'
                    , ${data.game_type}
                    , '${data.game_type_name}'
                    , '${data.field}'
                    , '${data.account}'
                    , ${data.bet_valid}           
                    , ${data.bet_amount}          
                    , ${data.got_amount}         
                    , ${data.win_amount}          
                    , ${data.lose_amount}         
                    , '${data.bet_content}'
                    , '${data.content}'
                    , '${data.result}'
                    , ${data.payoff}              
                    , '${data.payoff_at}'          
                    , ${data.feedback}
                    , ${data.wash}
                    , ${data.pca_contribute}
                    , ${data.pca_win}
                    , ${data.revenue}
                    , ${data.status}
                    , ${winlose}
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

    public callAPI( startTime, endTime ):Promise<IAPIResponse>{

        return new Promise(async (resolve, reject) => {

            let { baseURI, getBetAPI, pid, key} = this.env;

            let payload = {
                "pid": pid,
                "from_time": startTime+'Z',
                "to_time": endTime+'Z'
            };

            var token = jwt.sign(payload, key);
            //console.log(token);

            let fetchOptions = {
                method: 'POST'
                , headers: { 'Authorization': `Bearer ${token}`}
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
