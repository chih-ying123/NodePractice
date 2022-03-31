import { Test, TestingModule } from '@nestjs/testing';
import { BetDataController } from './bet-data.controller';

describe('BetData Controller', () => {
  let controller: BetDataController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BetDataController],
    }).compile();

    controller = module.get<BetDataController>(BetDataController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
