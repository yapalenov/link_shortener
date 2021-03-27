import './_env';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ApiModule } from '../api.module';

const PORT = +process.env.PORT;

export async function startApi() {
  const app = await NestFactory.create(ApiModule);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(PORT);
  return app;
}

startApi();
