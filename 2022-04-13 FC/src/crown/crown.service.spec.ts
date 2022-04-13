import { Test, TestingModule } from '@nestjs/testing';
import { crownService } from './crown.service';

describe('crownService', () => {
  let service: crownService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [crownService],
    }).compile();

    service = module.get<crownService>(crownService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
