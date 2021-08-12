import { Controller, Get, Query, Param, Req } from '@nestjs/common';
import * as moment from 'moment';
import { Common } from 'src/util';
import { PgslotService } from '../pgslot.service';


@Controller('wrin/pgslot/bet-data')
export class BetDataController {
    constructor(private service: PgslotService) { 
    
    }
    @Get()
    public Index(): Promise<string> {
        return Common.readHtml('./html/pgslot.html');
    }

    @Get('APIRequestList')
    public APIRequestList(@Query('date') date: string) {
        let dateTimelist = [];

        if (date != null && /\d\d\d\d-\d\d-\d\d/.test(date)) {
            dateTimelist = Common.dateSplitByMin(date, 120);
        }
        return date ;

    }
  
  }
