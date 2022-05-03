import { Module } from '@nestjs/common';
import { BetDataController } from './bet-data/bet-data.controller';
import { RTGService } from './rtg.service';

@Module({
  controllers: [BetDataController],
  providers: [RTGService]
})
export class RTGModule {}
