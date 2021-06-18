import { Module } from '@nestjs/common';
import { BetDataController } from './bet-data/bet-data.controller';
import { BgService } from './bg.service';

@Module({
  controllers: [BetDataController],
  providers: [BgService]
})
export class BgModule {}
