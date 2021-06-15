import * as fs from 'fs';
import { Logger } from '@nestjs/common';
import * as moment from 'moment';
import { Dir } from './Dir';

export class Log {
    /**
     * @param project_name => log/project_name/
     * @param data string|number|object|any...
     */
    public static WriteToFile(project_name: string, data: any) {
        let dir = `log/${project_name}`
        Dir.Make(dir) ;

        let file_path = `${dir}/${moment().format("MMDD_HH")}.txt`;
        const timestamp = moment().format("YYYY-MM-DD HH:mm:ss");

        fs.appendFile(file_path, `[${timestamp}]${JSON.stringify(data)}\r\n`, 'utf8', (err) => {
            if(err != undefined) {
                Logger.error(err, "Log:WriteToFile") ;
            }
        });
    }
}