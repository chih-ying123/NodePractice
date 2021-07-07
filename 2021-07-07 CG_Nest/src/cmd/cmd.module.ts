import { Module } from '@nestjs/common';
import { BetDataController } from './bet-data/bet-data.controller';
import { CmdService } from './cmd.service';

@Module({
  controllers: [BetDataController],
  providers: [CmdService]
})
export class CmdModule {}
