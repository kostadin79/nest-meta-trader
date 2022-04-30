import { Injectable } from '@nestjs/common';
import { of, Subject } from 'rxjs';
import {
  OrderList,
  TradingAccount,
  RatesDataList,
  MessageCallbak,
} from './Interface';

import { MetaTrader4 } from './MetaTrader4';

@Injectable()
export class MetaTraderService {
  MetaTrader = new MetaTrader4({
    apiKey: 'CHANGEME',
    reqUrl: 'tcp://127.0.0.1:5555',
    pullUrl: 'tcp://127.0.0.1:5556',
  });

  subscribedForRates = false;
  subscribedForOpenPositions = false;
  messageSubject: Subject<any> = new Subject<unknown>();

  constructor() {}

  getChartData(symbol: string) {
    return this.MetaTrader.getLastCandles(symbol);
  }
  getInitialOpenPositions(): Promise<any> {
    return this.MetaTrader.getOrders();
  }

  getInitialRates(data: string[]): Promise<any> {
    return this.MetaTrader.getMultipleRates(data);
  }

  listenForRates(ratesList: string[]): Promise<any> {
    if (!this.subscribedForRates) {
      this.MetaTrader.listen.prices(this.sendMessageToSocket);
      this.subscribedForRates = true;
    }

    return this.MetaTrader.subscribe.prices(ratesList);
  }

  listenForAccount() {
    this.MetaTrader.subscribe.account();
    this.MetaTrader.listen.account(this.sendMessageToSocket);
  }

  listenForOrders() {
    if (!this.subscribedForOpenPositions) {
      this.subscribedForOpenPositions = true;
      this.MetaTrader.listen.orders(this.sendMessageToSocket);
      return this.MetaTrader.subscribe.orders();
    } else {
      return of({ status: true });
    }
  }

  stopListenForOrders() {
    return this.MetaTrader.unSubscribe.orders();
  }

  stopListenForPrices(ratesList: string[]) {
    this.subscribedForRates = false;
    return this.MetaTrader.unSubscribe.prices(ratesList);
  }

  sendMessageToSocket: MessageCallbak<
    TradingAccount | OrderList | RatesDataList
  > = (event: string, data: TradingAccount | OrderList | RatesDataList) => {
    // @TODO Change event according client socket
    // console.log(messageType,data);
    this.messageSubject.next({ event, data });
  };

  connect() {
    this.MetaTrader.connect();
    this.MetaTrader.onConnect(() => {
      console.log('Connected');
      this.messageSubject.next({ event: 'TERMINAL_CONNECTED' });
    });
    this.MetaTrader.onDisconnect(() => {
      console.log('DISConnected');
      this.messageSubject.next({ event: 'TERMINAL_DISCONNECTED' });
    });
  }
}
