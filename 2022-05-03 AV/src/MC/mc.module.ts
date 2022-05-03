import { Module } from '@nestjs/common';
import { BetDataController } from './bet-data.controller';
import { MCService } from './mc.service';

@Module({
  controllers: [BetDataController],
  providers: [MCService]
})
export class MCModule {}
