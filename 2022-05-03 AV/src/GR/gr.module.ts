import { Module } from '@nestjs/common';
import { BetDataController } from './bet-data.controller';
import { GRService } from './gr.service';

@Module({
  controllers: [BetDataController],
  providers: [GRService]
})
export class GRModule {}
