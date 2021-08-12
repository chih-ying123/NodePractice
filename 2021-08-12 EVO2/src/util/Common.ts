import * as fs from 'fs';
import * as crypto from 'crypto';
import * as Muscache from 'mustache';

import * as moment from 'moment';

export class Common {
    static Formatter_Moment_0 = "YYYY-MM-DD";
    static Formatter_Moment_1 = "YYYY-MM-DD HH:mm:ss";
    static Formatter_Moment_2 = "YYYY-MM-DDTHH:mm:SS[Z]";

    static MD5(plaintext: string): string {
        const cipher = crypto.createHash('md5');
        let dist = cipher.update(plaintext, 'utf8').digest("hex");
        return dist;
    }

    static SHA1(plaintext: string): string {
        const cipher = crypto.createHash('sha1');
        let dist = cipher.update(plaintext, 'utf8').digest("hex");
        return dist;
    }
    //node.js AES/ECB/PKCS5Padding from:https://gist.github.com/legend80s/b952872651128625e4809ed973ad173d
    //加密
    static encrypt(input,key,iv) {
        const messageEncoding = 'utf8';
        const cipherEncoding = 'base64'
        const cipher = crypto.createCipheriv('aes-128-ecb', Buffer.from(key), iv);
        cipher.setAutoPadding(true);
        let encrypted = cipher.update(input, messageEncoding, cipherEncoding);
        encrypted += cipher.final(cipherEncoding);
        return encrypted;
    }
    //解密
    static decrypt(encrypted, key, iv) {
        const messageEncoding = 'utf8';
        const cipherEncoding = 'base64'
        const decipher = crypto.createDecipheriv('aes-128-ecb', Buffer.from(key), iv);
        decipher.setAutoPadding(true);
        let decrypted = decipher.update(encrypted, cipherEncoding, messageEncoding);
        decrypted += decipher.final(messageEncoding);
        return decrypted;
    }
    static getDateStr_FromDate(timestamp): string {
        let time = new Date(timestamp);
        let year = time.getFullYear();
        let month = String(time.getMonth() + 1); // month value: 0(一月) ~ 11(十二月)
        let date = String(time.getDate());
        let hour = String(time.getHours());
        let min = String(time.getMinutes());
        let second = String(time.getSeconds());

        if (Number.parseInt(month) < 10) {
            month = `0${month}`;
        }

        if (Number.parseInt(date) < 10) {
            date = `0${date}`;
        }

        if (Number.parseInt(hour) < 10) {
            hour = `0${hour}`;
        }

        if (Number.parseInt(min) < 10) {
            min = `0${min}`;
        }

        if (Number.parseInt(second) < 10) {
            second = `0${second}`;
        }

        return `${year}-${month}-${date} ${hour}:${min}:${second}`;
    }


    //把一天的時間單位按N分鐘切分出 start~end  
    static dateSplitByMin(date: string, min: number): Array<{ start: string, end: string }> {
        // date 是一個 yyyy-MM-dd 的字串
        let y = date.slice(0, 4); //不含end
        let m = date.slice(5, 7);
        let d = date.slice(8, 10);

        let count = (24 * 60) / min; // 算出一天全部有多少分鐘，再除掉min，得到迴圈計數器(以秒為單位)

        let list = [];
        for (let i = 0; i < count; i++) {
            // new Date(year, month, day, hour, minutes, seconds, milliseconds);
            let year = parseInt(y, 10);
            let month = parseInt(m, 10);
            let day = parseInt(d, 10);

            let start = new Date(year, month - 1, day, 0, 0, 0, 0);
            let end = new Date(year, month - 1, day, 0, 0, 0, 0);

            start.setSeconds(start.getSeconds() + i * min * 60); // setSeconds 沒傳回新的實例哦
            end.setSeconds(end.getSeconds() + (i + 1) * min * 60 - 1); // setSeconds 沒傳回新的實例哦

            list.push({
                start: this.getDateStr_FromDate(start),
                end: this.getDateStr_FromDate(end)
            });
        }

        return list;
    }

    // 指定時間並往前切割
    //      node_modules\moment\moment.d.ts
    //      unitOfTime.Base
    // date 基準時間( end_time )
    // step 往前切割次數
    // dt   持續時間
    // unit 切割單位
    static DateForwardSplit(date: moment.Moment, step: number, dt: number, unit: moment.DurationInputArg2): Array<{ start: string, end: string }> {
        let list = [];
        if (step <= 0) return list

        while (step--) {
            var e = date.format(Common.Formatter_Moment_1)
            var s = moment.unix(date.subtract(dt, unit).unix()).add(1,"s").format(Common.Formatter_Moment_1)
            list.push({
                start: s,
                end: e
            })
        }
        return list;
    }


    static readHtml(path: string): Promise<string> {

        return new Promise<string>((resolve, reject) => {

            fs.readFile(path, 'utf8', function (err, data) {
                if (err) {
                    return reject(err);
                }
                resolve(data);
            })
        });
    }

    static renderHtml(template: string, view: any): string {
        return Muscache.render(template, view);
    }

    // 延遲
    static Delay(ms: number) {
        return new Promise(res => setTimeout(() => res(), ms));
    }
}