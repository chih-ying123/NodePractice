import { Module } from '@nestjs/common';
import { BetDataController } from './bet-data/bet-data.controller';
import { FTGService } from './FTG.service';

@Module({
  controllers: [BetDataController],
  providers: [FTGService]
})
export class FTGModule {}
