import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { MetaTraderModule } from '../meta-trader/meta-trader.module';

@Module({
  imports: [MetaTraderModule],
  providers: [SocketGateway],
})
export class SocketModule {}
