import { Module } from '@nestjs/common';
import { BetDataController } from './bet-data/bet-data.controller';
import { V8PockerService } from './V8Pocker.service';

@Module({
  controllers: [BetDataController],
  providers: [V8PockerService]
})
export class V8PockerModule {}
