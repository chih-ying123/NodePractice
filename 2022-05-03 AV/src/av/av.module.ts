import { Module } from '@nestjs/common';
import { BetDataController } from './bet-data.controller';
import { AVService } from './av.service';

@Module({
  controllers: [BetDataController],
  providers: [AVService]
})
export class AvModule {}
