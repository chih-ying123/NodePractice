import { Test, TestingModule } from '@nestjs/testing';
import { JiliService } from './jili.service';

describe('JiliService', () => {
  let service: JiliService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JiliService],
    }).compile();

    service = module.get<JiliService>(JiliService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
