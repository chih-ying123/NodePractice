import { Test, TestingModule } from '@nestjs/testing';
import { RTGService } from './rtg.service';

describe('RtgService', () => {
  let service: RTGService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RTGService],
    }).compile();

    service = module.get<RTGService>(RTGService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
