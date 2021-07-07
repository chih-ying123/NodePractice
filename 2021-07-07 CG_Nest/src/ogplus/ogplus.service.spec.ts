import { Test, TestingModule } from '@nestjs/testing';
import { OgplusService } from './ogplus.service';

describe('OgplusService', () => {
  let service: OgplusService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OgplusService],
    }).compile();

    service = module.get<OgplusService>(OgplusService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
