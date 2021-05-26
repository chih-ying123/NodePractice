import { Module } from '@nestjs/common';
import { BetDataController } from './bet-data/bet-data.controller';
import { JiliService } from './jili.service';

@Module({
  controllers: [BetDataController],
  providers: [JiliService]
})
export class JiliModule {}
