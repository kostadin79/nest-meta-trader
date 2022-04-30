import { OP, REQUEST, UNIT_CONTRACTS } from './Enum';
import { MetaTrader4Connection } from './MetaTrader4Connection';
import {
  Order,
  TradingAccount,
  OrderList,
  RatesDataList,
  MessageCallbak,
} from './Interface';

export class MetaTrader4 extends MetaTrader4Connection {
  public getRates(
    symbol: string,
  ): Promise<{ bid: number; ask: number; symbol: string }> {
    // console.log('symbol->',symbol)
    return this.request(REQUEST.RATES, symbol);
  }

  public getMultipleRates(
    symbols: string[],
  ): Promise<{ bid: number; ask: number; symbol: string }> {
    console.log('symbol->', symbols);
    return this.request(REQUEST.MULTIPLE_RATES, symbols.join(','));
  }

  public getAccountInfo(): Promise<TradingAccount> {
    return this.request(REQUEST.ACCOUNT);
  }

  public getOrders(): Promise<Order[]> {
    return this.request(REQUEST.ORDERS);
  }

  public buy({
    symbol,
    volume,
    comment = 'null',
    sl = 0,
    tp = 0,
    slippage = 0,
    magicNumber = 0,
  }: {
    symbol: string;
    volume: number;
    comment: string;
    sl?: number;
    tp?: number;
    slippage?: number;
    magicNumber: number;
  }): Promise<void | { ticket: number }> {
    return volume <= 0
      ? Promise.reject('Volume is lower or equals 0')
      : this.request(
          REQUEST.TRADE_OPEN,
          symbol,
          OP.BUY,
          volume,
          0,
          0,
          sl,
          tp,
          comment,
          magicNumber,
          UNIT_CONTRACTS,
        );
  }

  public sell({
    symbol,
    volume,
    comment = 'null',
    sl = 0,
    tp = 0,
    slippage = 0,
    magicNumber = 0,
  }: {
    symbol: string;
    volume: number;
    comment?: string;
    sl?: number;
    tp?: number;
    slippage?: number;
    magicNumber?: number;
  }) {
    if (volume <= 0) {
      return Promise.reject('Volume is lower or equals 0');
    }
    return this.request(
      REQUEST.TRADE_OPEN,
      symbol,
      OP.SELL,
      volume,
      0,
      0,
      sl,
      tp,
      comment,
      magicNumber,
      UNIT_CONTRACTS,
    );
  }

  public close(order: number) {
    return this.request(REQUEST.CLOSE_MARKET_ORDER, order);
  }

  public closeAll(symbol: string) {
    return this.request(REQUEST.CLOSE_ALL_MARKET_ORDERS, symbol);
  }

  public getLastCandles(symbol: string): Promise<
    {
      time: string;
      open: number;
      low: number;
      high: number;
      close: number;
      volume: number;
    }[]
  > {
    return this.request(REQUEST.CHART, symbol);
  }

  listen = {
    account: (callBack: MessageCallbak<TradingAccount>) => {
      this.addListener('ACCOUNT', callBack);
    },
    orders: (callBack: MessageCallbak<OrderList>) => {
      this.addListener('ORDERS', callBack);
    },
    prices: (callBack: MessageCallbak<RatesDataList>) => {
      this.addListener('PRICES', callBack);
    },
  };

  subscribe = {
    account: () => {
      return this.request(REQUEST.SUBSCRIBE_ACCOUNT);
    },
    orders: () => {
      return this.request(REQUEST.SUBSCRIBE_ORDERS);
    },
    prices: (symbols: string[]) => {
      return this.request(REQUEST.SUBSCRIBE_PRICES, symbols.join(','));
    },
  };

  unSubscribe = {
    account: () => {
      return this.request(REQUEST.UNSUBSCRIBE_ACCOUNT);
    },
    orders: () => {
      return this.request(REQUEST.UNSUBSCRIBE_ORDERS);
    },
    prices: (symbols: string[]) => {
      return this.request(REQUEST.UNSUBSCRIBE_PRICES, symbols.join(','));
    },
  };
}
