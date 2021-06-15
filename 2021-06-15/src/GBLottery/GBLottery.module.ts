import { Module } from '@nestjs/common';
import { BetDataController } from './bet-data/bet-data.controller';
import { GBLotteryService } from './GBLottery.service';

@Module({
  controllers: [BetDataController],
  providers: [GBLotteryService]
})
export class GBLotteryModule {}
