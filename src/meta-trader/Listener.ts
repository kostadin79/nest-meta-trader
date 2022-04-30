import { MessageCallbak } from './Interface';

export class Listener {
  constructor() {}

  private _listeners: any = {};

  public get listeners() {
    return this._listeners;
  }

  public addListener(
    listenerId: string,
    callBack: MessageCallbak<unknown>,
    key: string | null = null,
  ) {
    if (typeof callBack !== 'function') {
      return;
    }
    if (this._listeners[listenerId] === undefined) {
      this._listeners[listenerId] = {};
    }
    if (key === null) {
      key = 'g' + Object.keys(this._listeners[listenerId]).length;
      this._listeners[listenerId][key] = callBack;
    } else {
      this._listeners[listenerId]['s' + key] = callBack;
    }
  }

  public callListener(listenerId: string, params: any[] = []) {
    if (this._listeners[listenerId] !== undefined) {
      Object.keys(this._listeners[listenerId]).forEach((key: string) => {
        // console.log(listenerId);
        this._listeners[listenerId][key](listenerId, ...params);
      });
    }
  }
}
