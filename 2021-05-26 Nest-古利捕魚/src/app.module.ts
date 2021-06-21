import * as fs from 'fs';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RTGModule } from './rtg/rtg.module';
import { AginModule } from './agin/agin.module';
import { SboModule } from './sbo/sbo.module';
import { JiliModule } from './jili/Jili.module';
import { JiLiFishingModule } from './JiLiFishing/ji-li-fishing.module';

let env_path = "./public/share/prod.env";
if (!fs.existsSync(env_path)) env_path = "./public/share/.env";

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: env_path }),
    RTGModule,
    AginModule,
    SboModule, 
    JiliModule,
    JiLiFishingModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }