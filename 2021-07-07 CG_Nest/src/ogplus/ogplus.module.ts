import { Module } from '@nestjs/common';
import { BetDataController } from './bet-data/bet-data.controller';
import { OgplusService } from './ogplus.service';

@Module({
  controllers: [BetDataController],
  providers: [OgplusService]
})
export class OGPlusModule { }
