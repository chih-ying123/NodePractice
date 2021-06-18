import { Module } from '@nestjs/common';
import { BetDataController } from './bet-data/bet-data.controller';
import { WinnerlivedonateService } from './winnerlivedonate.service';

@Module({
  controllers: [BetDataController],
  providers: [WinnerlivedonateService]
})
export class WinnerlivedonateModule {}
