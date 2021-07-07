import { Module } from '@nestjs/common';
import { BetDataController } from './bet-data/bet-data.controller';
import { BoleService } from './bole.service';

@Module({
  controllers: [BetDataController],
  providers: [BoleService]
})
export class BoleModule {}
