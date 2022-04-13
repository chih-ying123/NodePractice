import { Test, TestingModule } from '@nestjs/testing';
import { rich88Service } from './rich88.service';

describe('rich88Service', () => {
  let service: rich88Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [rich88Service],
    }).compile();

    service = module.get<rich88Service>(rich88Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
