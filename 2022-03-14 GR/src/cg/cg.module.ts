import { Module } from '@nestjs/common';
import { CgController } from './cg.controller';
import { CgService } from './cg.service';

@Module({
  controllers: [CgController],
  providers: [CgService]
})
export class CgModule {}
