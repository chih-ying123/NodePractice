import { Module } from '@nestjs/common';
import { BetDataController } from './bet-data.controller';
import { FunkyService } from './funky.service';

@Module({
  controllers: [BetDataController],
  providers: [FunkyService]
})
export class FunkyModule {}
