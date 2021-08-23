import { Module } from '@nestjs/common';
import { BetDataController } from './bet-data/bet-data.controller';
import { PgslotService } from './pgslot.service';

@Module({
  controllers: [BetDataController],
  providers: [PgslotService]
})
export class PgslotModule {}
