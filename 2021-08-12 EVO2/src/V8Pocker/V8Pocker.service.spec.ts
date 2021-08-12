import { Test, TestingModule } from '@nestjs/testing';
import { V8PockerService } from './V8Pocker.service';

describe('V8PockerService', () => {
  let service: V8PockerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [V8PockerService],
    }).compile();

    service = module.get<V8PockerService>(V8PockerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
