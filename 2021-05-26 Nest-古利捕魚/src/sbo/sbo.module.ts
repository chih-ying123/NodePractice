import { Module } from '@nestjs/common';
import { BetDataController } from './bet-data/bet-data.controller';
import { SboService } from './sbo.service';

@Module({
  controllers: [BetDataController],
  providers: [SboService]
})
export class SboModule {}
