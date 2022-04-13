import { Module } from '@nestjs/common';
import { BetDataController } from './bet-data/bet-data.controller';
import { rich88Service } from './rich88.service';

@Module({
  controllers: [BetDataController],
  providers: [rich88Service]
})
export class rich88Module {}
