import { Test, TestingModule } from '@nestjs/testing';
import { BgFishingService } from './BgFishing.service';

describe('BgFishingService', () => {
  let service: BgFishingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BgFishingService],
    }).compile();

    service = module.get<BgFishingService>(BgFishingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
