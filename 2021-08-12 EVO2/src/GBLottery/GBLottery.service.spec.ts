import { Test, TestingModule } from '@nestjs/testing';
import { GBLotteryService } from './GBLottery.service';

describe('GBLotteryService', () => {
  let service: GBLotteryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GBLotteryService],
    }).compile();

    service = module.get<GBLotteryService>(GBLotteryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
