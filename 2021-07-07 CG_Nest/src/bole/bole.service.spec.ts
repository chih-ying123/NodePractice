import { Test, TestingModule } from '@nestjs/testing';
import { BoleService } from './bole.service';

describe('BoleService', () => {
  let service: BoleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BoleService],
    }).compile();

    service = module.get<BoleService>(BoleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
