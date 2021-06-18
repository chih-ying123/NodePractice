import { Module } from '@nestjs/common';
import { BetDataController } from './bet-data/bet-data.controller';
import { TFGamingService } from './TFGaming.service';

@Module({
  controllers: [BetDataController],
  providers: [TFGamingService]
})
export class TFGamingModule {}
