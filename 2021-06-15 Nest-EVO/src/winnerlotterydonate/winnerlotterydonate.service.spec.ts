import { Test, TestingModule } from '@nestjs/testing';
import { WinnerlotterydonateService } from './winnerlotterydonate.service';

describe('WinnerlotterydonateService', () => {
  let service: WinnerlotterydonateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WinnerlotterydonateService],
    }).compile();

    service = module.get<WinnerlotterydonateService>(WinnerlotterydonateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
