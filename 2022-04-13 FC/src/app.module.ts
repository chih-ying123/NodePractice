import * as fs from 'fs';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FTGModule } from './FTG/FTG.module';
import { crownModule } from './crown/crown.module';
import { EvoModule } from './evo/evo.module';
import { rich88Module } from './rich88/rich88.module';
import { AWSModule } from './AWS/AWS.module';
import { CgModule } from './cg/cg.module';
import { FunkyModule } from './funky/funky.module';
import { FCModule } from './FC/fc.module';


let env_path = "./public/share/prod.env";
if (!fs.existsSync(env_path)) env_path = "./public/share/.env";

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: env_path })
    ,  FTGModule 
    , crownModule
    , EvoModule
    , rich88Module 
    , AWSModule
    , CgModule
    , FunkyModule
    , FCModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }