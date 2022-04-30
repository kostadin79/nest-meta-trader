import {Rate} from '@terminal/api-interfaces';

export interface TradingAccount {
  currency: string;
  balance: number;
  profit: number;
  equity: number;
  margin: number;
  margin_free: number;
  margin_level: number;
  margin_call_level: number;
  margin_stop_out_level: number;
  leverage: number;
}

export interface Order {
  order: number;
  open_time: string;
  type: number;
  volume: number;
  symbol: string;
  price: number;
  sl: number;
  tp: number;
  commission: number;
  swap: number;
  profit: number;
  comment: string;
}
export type OrderList = Array<Order>;
export interface MessageCallbak<T> {
  (event: string, data: T): void;
}


export type RatesDataList = Array<Rate>;
// export type afterMessageCallbak = <T>(messageType:string,data:T) => void;
