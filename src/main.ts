import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

const configSv = new ConfigService();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: '*' });
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(Number(configSv.get('APP_PORT', 3000)),String(configSv.get('APP_HOST', "localhost")));
}
bootstrap();
