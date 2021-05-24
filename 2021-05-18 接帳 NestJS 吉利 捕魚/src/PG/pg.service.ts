import { Injectable } from '@nestjs/common';

@Injectable()
export class PgService {

    public async getBetData(startTime, endTime){
        return '123';
    };

}
