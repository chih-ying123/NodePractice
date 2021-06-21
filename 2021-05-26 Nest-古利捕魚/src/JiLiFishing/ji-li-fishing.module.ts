import { Module } from '@nestjs/common';
import { BetDataController } from './bet-data.controller';
import { JiLiFishingService } from './ji-li-fishing.service';

@Module({
  controllers: [BetDataController],
  providers: [JiLiFishingService]
})
export class JiLiFishingModule {}
