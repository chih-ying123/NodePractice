import { Test, TestingModule } from '@nestjs/testing';
import { FTGService } from './FTG.service';

describe('FTGService', () => {
  let service: FTGService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FTGService],
    }).compile();

    service = module.get<FTGService>(FTGService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
