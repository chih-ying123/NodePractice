import { Controller, Get, Query, Logger, Req, Param } from '@nestjs/common';
import * as moment from 'moment';
import { Common } from 'src/util';
import { BoleService } from '../bole.service';

@Controller('wrc/bole/bet-data')
export class BetDataController {
    constructor(private service: BoleService) {
        Logger.debug('build bole !!');
    }
    @Get()
    public Index() {
        // this.start("2020-04-29 14:00:00","2020-04-29 16:25:00")
        return Common.readHtml('./html/bole.html');
    }

    private async start(start: string, end: string) {
        // Logger.debug("bole:[start]"+start+"[end]"+end)

        // fix time cause valid error
        let t = moment().add(-6, "m");
        let s = moment(start);
        let n = moment();

        if (s.valueOf() > n.valueOf()) return

        if (moment(end).valueOf() > t.valueOf()) end = t.format("YYYY-MM-DD HH:mm:ss");
        if (s.valueOf() > t.valueOf()) return

        var all_record = await this.service.GetAllRecord(start, end)

        all_record.forEach(x => {
            if (x.type == "multi") {
                // Logger.debug("百人")
                // this.service.GetMultiRecordDetails(x).then(d => this.service.SaveBetData(x, d))

                this.service.SaveBetData(x, "") ;
            }
            else if (x.type == "contest") {
                // Logger.debug("對戰")
                // this.service.GetPlayBack(x).then(d => this.service.SaveBetData(x, d))

                this.service.SaveBetData(x, "") ;
            }
            else {
                Logger.debug("error:bole:unknow type:")
                Logger.debug(x)
            }
        })


        var race_log = await this.service.GetRaceLog(start, end);
        race_log.forEach(x => {

            for (var key in x.ext.reward) {
                let item = x.ext.reward[key]
                this.service.SaveRaceLog(x, item)
            }

        })
    }

    @Get('APIRequestList')
    public APIRequestList(@Query('date') date: string) {
        if (date == undefined || date.length == 0) return "";
        let now = moment(date).format(Common.Formatter_Moment_0);
        let yesterday = moment(now).add(-1, "days").format(Common.Formatter_Moment_0);
        return Common.dateSplitByMin(yesterday, 120).concat(Common.dateSplitByMin(date, 120));
    }

    @Get('CallBySchedule/:start/:end')
    public async CallBySchedule(@Req() req, @Param() date) {
        this.start(date.start, date.end);
        return JSON.stringify({ "code": "OK", "message": "" })
    }

}