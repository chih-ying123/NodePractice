import { Injectable } from '@nestjs/common';
import { Config, Dial, Loader, Log } from 'src/util';
import { IEnv } from './env.interface';
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
        
        let apiResponse = await this.callAPI(startDate, endDate); 
        return apiResponse;          
    }

    public callAPI(startTime, endTime){

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
                console.log(datas);
                
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
        encrypted = encrypted.toString();
        return encrypted; 

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
        decrypted = enc.Utf8.stringify(decrypted);
        return decrypted;
    }
}
