import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WssAdapter } from './adapters/wss-adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useWebSocketAdapter(new WssAdapter(app));
  await app.listen(3000);
}
bootstrap();
