import { Test, TestingModule } from '@nestjs/testing';
import { AginService } from './agin.service';

describe('AginService', () => {
  let service: AginService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AginService],
    }).compile();

    service = module.get<AginService>(AginService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
