import { Test, TestingModule } from '@nestjs/testing';
import { MetaTraderService } from './meta-trader.service';

describe('MetaTraderService', () => {
  let service: MetaTraderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MetaTraderService],
    }).compile();

    service = module.get<MetaTraderService>(MetaTraderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
