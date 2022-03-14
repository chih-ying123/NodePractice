import { Module } from '@nestjs/common';
import { BetDataController } from './bet-data/bet-data.controller';
import { AginService } from './agin.service';

@Module({
  controllers: [BetDataController],
  providers: [AginService]
})
export class AginModule { }
