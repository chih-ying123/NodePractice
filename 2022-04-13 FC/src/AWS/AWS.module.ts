import { Module } from '@nestjs/common';
import { BetDataController } from './bet-data/bet-data.controller';
import { AWSService } from './AWS.service';

@Module({
  controllers: [BetDataController],
  providers: [AWSService]
})
export class AWSModule { }
