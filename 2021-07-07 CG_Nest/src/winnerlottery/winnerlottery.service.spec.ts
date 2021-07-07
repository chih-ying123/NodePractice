import { Test, TestingModule } from '@nestjs/testing';
import { WinnerlotteryService } from './winnerlottery.service';

describe('WinnerlotteryService', () => {
  let service: WinnerlotteryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WinnerlotteryService],
    }).compile();

    service = module.get<WinnerlotteryService>(WinnerlotteryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
