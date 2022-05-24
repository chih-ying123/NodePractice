import { Test, TestingModule } from '@nestjs/testing';
import { SboService } from './sbo.service';

describe('SboService', () => {
  let service: SboService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SboService],
    }).compile();

    service = module.get<SboService>(SboService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
