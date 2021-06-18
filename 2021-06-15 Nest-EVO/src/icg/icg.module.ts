import { Module } from '@nestjs/common';
import { BetDataController } from './bet-data/bet-data.controller';
import { IcgService } from './icg.service';

@Module({
  controllers: [BetDataController],
  providers: [IcgService]
})
export class IcgModule {}
