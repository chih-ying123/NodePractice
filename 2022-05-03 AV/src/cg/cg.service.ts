import { Injectable } from '@nestjs/common';
import { Config, Dial, Loader, Log } from 'src/util';
import { IEnv, IAPIResponse, IData } from './env.interface';
import fetch from 'node-fetch';
import { Connection } from 'typeorm';
import { enc, AES, mode as _mode, pad } from "crypto-js";
import { URLSearchParams } from "url";

@Injectable()
export class CgService {

    private env: IEnv;
    constructor() {
        this.env = Loader.GetENV<IEnv>("./public/cg/env.json")
    }
    private conn: Connection;

    public async getBetData(startDate, endDate){
        
        try{
            let apiResponse = await this.callAPI(startDate, endDate); 
            
            if (apiResponse.errorCode === 0){
                this.SaveDataIntoDB(apiResponse.data) ;
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
               
                return
            }

        }

        for(let i=0; i< datas.length; i++){
            let data = datas[i];
            let LogTime = data.LogTime.replace('T', ' ').replace('+08:00', '');
            let WinLose = data.MoneyWin - data.ValidBet; 
            
            let cmd = (`call NSP_BetData_Insert_CG(                
                       ${data.SerialNumber}
                    , '${data.GameType}'
                    , '${LogTime}'
                    ,  ${data.BetMoney}
                    ,  ${data.MoneyWin}
                    ,  ${data.NormalWin}
                    ,  ${data.BonusWin}
                    ,  ${data.JackpotMoney}
                    , '${data.ThirdPartyAccount}'
                    ,  ${data.ValidBet}
                    , '${data.Device}'
                    , '${data.IPAddress}'
                    ,  ${WinLose}
                );`
            );  
                     

            try{                
                
                this.conn.query(cmd);
            }
            catch(err){
                continue; //繼續往下一筆執行
                console.log(err);
            }
        }
        
        
        

        
    }

    public callAPI(startTime, endTime):Promise<IAPIResponse>{

        return new Promise(async (resolve, reject) => {

           //2018-06-24T00:00:00.646+01:00

            startTime = startTime.replace(' ', 'T') + '.000+08:00'
            endTime = endTime.replace(' ', 'T') + '.999+08:00'
            let dataObject = {
                "startTime": startTime,
                "endTime": endTime,
                "method": "data"
            };

            let dataString = JSON.stringify(dataObject);

            let key = this.env.key;
            let iv = this.env.iv;
            let afterEncrypted = this.Encrypt(dataString, key, iv);
            //console.log('參數明文:' + dataString);
            //console.log('參數密文:' + afterEncrypted);

            const params = new URLSearchParams();
            params.append('channelId', this.env.channelId);
            params.append('data', afterEncrypted);

            let fetchOptions = {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                , method: 'POST'
                , body: params
            };
            try {
                let response = await fetch(`${this.env.apiURI}`, fetchOptions);
                let textData = await response.text();
                //console.log(textData);

                let afterDecrypted = this.Decrypt(textData, key, iv);
                let datas = JSON.parse(afterDecrypted);
                //console.log(datas);
                
                resolve(datas);
            }
            catch (err) {
                reject(err);
            }
        });
    }


    //加密
    public Encrypt(str, ikey, iiv){

        ikey = enc.Base64.parse(ikey);
        iiv = enc.Base64.parse(iiv);
        
        var encrypted = AES.encrypt(str, ikey, {
            iv: iiv,
            mode: _mode.CBC,					
            padding: pad.Pkcs7					
        });
        
        // to string
        
        return encrypted.toString(); 

    }

    //解密
    public Decrypt(str, ikey, iiv){
        
        ikey = enc.Base64.parse(ikey);
        iiv = enc.Base64.parse(iiv);
        
        var decrypted = AES.decrypt(str, ikey, {
            iv: iiv,
            mode: _mode.CBC,					
            padding: pad.Pkcs7					
        });
        
        // convert to utf8 string
        
        return enc.Utf8.stringify(decrypted);
    }
}
