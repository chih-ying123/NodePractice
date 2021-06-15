import { Test, TestingModule } from '@nestjs/testing';
import { WinnerlivedonateService } from './winnerlivedonate.service';

describe('WinnerlivedonateService', () => {
  let service: WinnerlivedonateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WinnerlivedonateService],
    }).compile();

    service = module.get<WinnerlivedonateService>(WinnerlivedonateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
