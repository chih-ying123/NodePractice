import { Module } from '@nestjs/common';
import { BetDataController } from './bet-data.controller';
import { JiLiFishingService } from './ji-li-fishing.service';
import { JiLiFishingServiceService } from './ji-li-fishing-service.service';

@Module({
  controllers: [BetDataController],
  providers: [JiLiFishingService, JiLiFishingServiceService]
})
export class JiLiFishingModule {}
