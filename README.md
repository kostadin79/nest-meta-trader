[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

# Connect Meta Trader 4 with NestJS Socket Gateway trough ZeroMQ 

## Before to start 

Before to start the project, the Meta Trader 4 terminal must be started with  MetaTrader4Bridge2.mq4 activated.
More about that [MQL 4 Folder for ZeroMQ for Meta Trader 4](https://github.com/kostadin79/zeromq-meta-trader)

### Example usage

ZeroMQ ports and password can be changed in meta-trader.service.ts
```ts
import { MetaTrader4 } from './MetaTrader4';

@Injectable()
export class MetaTraderService {
    MetaTrader = new MetaTrader4({
        apiKey: 'CHANGEME',
        reqUrl: 'tcp://127.0.0.1:5555',
        pullUrl: 'tcp://127.0.0.1:5556',
    });
}
```

WS Socket is started on port 8888 in socket.gateway.ts
```ts
@WebSocketGateway(8888)
export class SocketGateway implements OnGatewayInit {
    @WebSocketServer()
    server: Server;
    subscription: Subscription;
    currentRates: any;

    constructor(private mtService: MetaTraderService) {
        this.mtService.connect();
    }
}
```
To connect meta-trader.service with Meta Trader 4 trough ZeroMQ is used the [Peter Szombati project](https://github.com/peterszombati/metatrader4) 

## Sources 

[Connection between MetaTrader4 and NodeJS](https://github.com/peterszombati/metatrader4#connection-between-metatrader4-and-nodejs) Typescript ZeroMQ Socket

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

