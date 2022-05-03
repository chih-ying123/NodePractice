import { Injectable } from '@nestjs/common';
import { Config, Dial, Loader, Log, Common } from 'src/util';
import fetch from 'node-fetch';
import { Connection } from 'typeorm';
import { IEnv, IbetDetails } from './env.interface';
import CryptoJS from 'crypto-js';

@Injectable()
export class AVService {

    private env: IEnv;
    constructor() {
        this.env = Loader.GetENV<IEnv>("./public/av/env.json");
    }
    private conn: Connection;

    public WriteToFile(data: any) {
        Log.WriteToFile("AV", data);
    }

     public async getBetData(startTime, endTime){
        try{
            let apiResponse = await this.callAPI(startTime, endTime);
            
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
    


    public async SaveDataIntoDB(datas: IbetDetails[], dataType){

        if (this.conn == null) {
            this.conn = await Dial.GetSQLConn(Config.DB);
            if (this.conn == null) {
                return;
            }
        }
        
        for(let i=0; i< datas.length; i++){
            let data = datas[i];

            let winlose = data.win - data.bet; 
            let cmd = (`call NSP_BetData_Insert_AV(
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
                    , '${data.roundDetails.replace('\\\"','\"')}'
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

    public callAPI(startTime, endTime ):Promise<string>{

        return new Promise(async (resolve, reject) => {
            
            let { baseURI, getBetAPI, secretkey, md5key, encryptkey } = this.env;
            let timevalueOf = new Date().valueOf()-1000*60*60;
            let time = Common.getDateStr_FromDate(timevalueOf).replace(/-/g,'').replace(/:/g,'').replace(' ','');
            console.log(time);

            let postBody = {
                "method": getBetAPI
                , "Key": secretkey
                , "Time": time
                , "FromTime": startTime
                , "ToTime": endTime
            }
            let postBodyArray = [];
            for (let pkey in postBody) {
                postBodyArray.push(`${pkey}=${postBody[pkey]}`);
            }
            let QS = postBodyArray.join('&');
            console.log(QS);
            
            
            let encryptQS = this.encryptByDES(QS, encryptkey);
            console.log(encryptQS);
            
            let q = encodeURIComponent(encryptQS).replace(/%../g,  match => match.toLowerCase());
            console.log(q);
            let s = Common.MD5(QS + md5key + time + secretkey);

            let fetchOptions = {
                method: 'POST'
                , headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                , body: `q=${q}&s=${s}`
            }
            
            try {
                let response = await fetch(`${baseURI}`, fetchOptions);
                let jsonData = await response.text();
                
                resolve(jsonData);
            }
            catch (err) {
                reject(err);
            }
            
        });
    }

    public encryptByDES(message, key){
        var keyHex = CryptoJS.enc.Utf8.parse(key);
        var encrypted = CryptoJS.DES.encrypt(message, keyHex, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });
        return encrypted.ciphertext.toString();
    }
}
