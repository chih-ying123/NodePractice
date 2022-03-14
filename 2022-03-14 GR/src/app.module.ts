import * as fs from 'fs';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RTGModule } from './rtg/rtg.module';
import { AginModule } from './agin/agin.module';
import { SboModule } from './sbo/sbo.module';
import { CmdModule } from './cmd/cmd.module';
import { CgModule } from './cg/cg.module';
import { MCModule } from './MC/mc.module';
import { GRModule } from './GR/gr.module';

let env_path = "./public/share/prod.env";
if (!fs.existsSync(env_path)) env_path = "./public/share/.env";

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: env_path }),
    RTGModule,
    AginModule,
    SboModule,
    CmdModule,
    CgModule,
    MCModule,
    GRModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }