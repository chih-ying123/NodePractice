import { Test, TestingModule } from '@nestjs/testing';
import { PgslotService } from './pgslot.service';

describe('PgslotService', () => {
  let service: PgslotService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PgslotService],
    }).compile();

    service = module.get<PgslotService>(PgslotService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
