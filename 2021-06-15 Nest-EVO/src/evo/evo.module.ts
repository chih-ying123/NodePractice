import { Module } from '@nestjs/common';
import { EvoController } from './evo.controller';
import { EvoService } from './evo.service';

@Module({
  controllers: [EvoController],
  providers: [EvoService]
})
export class EvoModule {}
