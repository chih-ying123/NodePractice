import { Module } from '@nestjs/common';
import { BetDataController } from './bet-data/bet-data.controller';
import { WinnerlotteryService } from './winnerlottery.service';

@Module({
  controllers: [BetDataController],
  providers: [WinnerlotteryService]
})
export class WinnerlotteryModule {}
