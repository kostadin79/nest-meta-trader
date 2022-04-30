import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  WsResponse,
MessageBody
} from '@nestjs/websockets';
import { from, Observable, Subscription } from 'rxjs';
import { Server } from 'ws';
import {map} from 'rxjs/operators';

import { REQUEST } from '../meta-trader/Enum';
import {Rate} from '@terminal/api-interfaces';

import { MetaTraderService } from '../meta-trader/meta-trader.service';

@WebSocketGateway(8888)
export class SocketGateway implements OnGatewayInit {
  @WebSocketServer()
  server: Server;
  subscription: Subscription;
  currentRates: any;

  constructor(private mtService: MetaTraderService) {
    this.mtService.connect();
  }

  afterInit(socketServer) {
    // console.log('socketServer',socketServer);

    socketServer.on('connection', (ws: WebSocket) => {
      this.subscription = this.mtService.messageSubject.subscribe((data) => {
        // console.log('data->',data);
        ws.send(JSON.stringify(data));
      });
    });
  }

  @SubscribeMessage('GET_ACCOUNT')
  handleAccount(): any {
    console.log('GET_ACCOUNT');
    return from(this.mtService.MetaTrader.request(REQUEST.ACCOUNT));
  }

  @SubscribeMessage('OPEN_POSITIONS')
  handleOpenPositions(): any {
    console.log('OPEN_POSITIONS');
    const event = 'OPEN_POSITIONS';
    return from(this.mtService.getInitialOpenPositions()).pipe(map(data =>({event,data})));
  }

  @SubscribeMessage('CHART')
  handleChart(@MessageBody() data: string): any {
    console.log('CHART');
    const event = 'CHART';
    return from(this.mtService.getChartData(data)).pipe(map(data =>({event,data})));
  }


  @SubscribeMessage('SUBSCRIBE_OPEN_POSITIONS')
  subscribeOpenPositions(): any {
    console.log('SUBSCRIBE_OPEN_POSITIONS');
    return this.mtService.listenForOrders()
  }

  @SubscribeMessage('UNSUBSCRIBE_OPEN_POSITIONS')
  unsubscribeOpenPositions(): any {
    console.log('UNSUBSCRIBE_OPEN_POSITIONS');
    return this.mtService.stopListenForOrders();
  }

  @SubscribeMessage('SUBSCRIBE_RATES')
  subscribeRates(@MessageBody() data: string[]): any {
    console.log('PRICES',data);
   return this.mtService.listenForRates(data);

  }
  @SubscribeMessage('UNSUBSCRIBE_RATES')
  unsubscribeRates(@MessageBody() data: string[]): any {
    console.log('PRICES',data);
   return this.mtService.stopListenForPrices(data);

  }


  @SubscribeMessage('MULTIPLE_RATES')
  handleMultipleRates(@MessageBody() data: string[]): Observable<WsResponse<{event:string,data:Rate[]}>> {
    console.log('PRICES',data);
  //  return this.mtService.listenForPrices(data);
  const event = 'MULTIPLE_RATES';
    return from(this.mtService.getInitialRates(data)).pipe(map(data => ({event,data})));
  }

}
