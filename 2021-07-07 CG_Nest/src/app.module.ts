import * as fs from 'fs';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OGPlusModule } from './ogplus/ogplus.module';
import { BgModule } from './bg/bg.module';
import { AginModule } from './agin/agin.module';
import { SboModule } from './sbo/sbo.module';
import { WinnerlotteryModule } from './winnerlottery/winnerlottery.module';
import { WinnerlotterydonateModule } from './winnerlotterydonate/winnerlotterydonate.module';
import { WinnerlivedonateModule } from './winnerlivedonate/winnerlivedonate.module';
import { BoleModule } from './bole/bole.module';
import { CgModule } from './cg/cg.module';

let env_path = "./public/share/prod.env";
if (!fs.existsSync(env_path)) env_path = "./public/share/.env";

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: env_path })
    , OGPlusModule
    , BgModule
    , BoleModule
    , AginModule
    , SboModule
    , WinnerlotteryModule
    , WinnerlotterydonateModule
    , WinnerlivedonateModule
    , CgModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }