import { Module } from '@nestjs/common';
import { BetDataController } from './bet-data.controller';
import { PPService } from './pp.service';

@Module({
  controllers: [BetDataController],
  providers: [PPService]
})
export class PpModule {}
