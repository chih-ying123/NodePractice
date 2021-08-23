import { Test, TestingModule } from '@nestjs/testing';
import { TFGamingService } from './TFGaming.service';

describe('TFGamingService', () => {
  let service: TFGamingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TFGamingService],
    }).compile();

    service = module.get<TFGamingService>(TFGamingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
