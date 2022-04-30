import { Module } from '@nestjs/common';
import { MetaTraderService } from './meta-trader.service';

@Module({
  providers: [MetaTraderService],
  exports: [MetaTraderService],
})
export class MetaTraderModule {}
