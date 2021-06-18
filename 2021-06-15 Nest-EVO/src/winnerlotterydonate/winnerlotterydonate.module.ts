import { Module } from '@nestjs/common';
import { BetDataController } from './bet-data/bet-data.controller';
import { WinnerlotterydonateService } from './winnerlotterydonate.service';

@Module({
  controllers: [BetDataController],
  providers: [WinnerlotterydonateService]
})
export class WinnerlotterydonateModule {}
