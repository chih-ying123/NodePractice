import { Module } from '@nestjs/common';
import { BetDataController } from './bet-data/bet-data.controller';
import { sbo_VRService } from './sbo_VR.service';

@Module({
  controllers: [BetDataController],
  providers: [sbo_VRService]
})
export class sbo_VRModule {}
