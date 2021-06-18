import * as fs from 'fs';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WinnerlotterydonateModule } from './winnerlotterydonate/winnerlotterydonate.module';
import { WinnerlivedonateModule } from './winnerlivedonate/winnerlivedonate.module';
import { TFGamingModule } from './TFGaming/TFGaming.module';
import { IcgModule } from './icg/icg.module';
import { BgModule } from './bg/bg.module';
import { BgFishingModule } from './bgfishing/bgfishing.module';
import { SboModule } from './sbo/sbo.module';
import { sbo_VRModule } from './sbo_VR/sbo_VR.module';
import { GBLotteryModule } from './GBLottery/GBLottery.module';
import { PgslotModule } from './pgslot/pgslot.module';
import { EvoModule } from './evo/evo.module';


let env_path = "./public/share/prod.env";
if (!fs.existsSync(env_path)) env_path = "./public/share/.env";

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: env_path })
    , WinnerlotterydonateModule
    , WinnerlivedonateModule
    , TFGamingModule
    , IcgModule
    , BgModule
    , BgFishingModule
    , SboModule
    , sbo_VRModule
    , GBLotteryModule
    , PgslotModule
    , EvoModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }