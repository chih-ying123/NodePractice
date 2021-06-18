import { Test, TestingModule } from '@nestjs/testing';
import { IcgService } from './icg.service';

describe('IcgService', () => {
  let service: IcgService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IcgService],
    }).compile();

    service = module.get<IcgService>(IcgService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
