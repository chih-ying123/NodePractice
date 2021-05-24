import { Controller, Get, Query, Logger, Req, Param } from '@nestjs/common';
import { Common } from 'src/util';

@Controller('PG')
export class PgController {

    @Get('/')
    public Index() {
        return Common.readHtml('./html/PG.html');
    }
}
