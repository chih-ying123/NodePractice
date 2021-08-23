import { Test, TestingModule } from '@nestjs/testing';
import { sbo_VRService } from './sbo_VR.service';

describe('sbo_VRService', () => {
  let service: sbo_VRService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [sbo_VRService],
    }).compile();

    service = module.get<sbo_VRService>(sbo_VRService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
