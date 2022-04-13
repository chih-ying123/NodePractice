import { Module } from '@nestjs/common';
import { BetDataController } from './bet-data.controller';
import { FCService } from './fc.service';

@Module({
  controllers: [BetDataController],
  providers: [FCService]
})
export class FCModule {}
