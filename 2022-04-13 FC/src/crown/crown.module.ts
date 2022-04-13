import { Module } from '@nestjs/common';
import { BetDataController } from './bet-data/bet-data.controller';
import { crownService } from './crown.service';

@Module({
  controllers: [BetDataController],
  providers: [crownService]
})
export class crownModule {}
