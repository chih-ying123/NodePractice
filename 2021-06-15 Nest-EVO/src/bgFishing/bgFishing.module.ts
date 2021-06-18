import { Module } from '@nestjs/common';
import { BetDataController } from './bet-data/bet-data.controller';
import { BgFishingService } from './BgFishing.service';

@Module({
  controllers: [BetDataController],
  providers: [BgFishingService]
})
export class BgFishingModule {}
