import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import * as helmet from 'helmet';
import { BadRequestException, ClassSerializerInterceptor, ValidationError, ValidationPipe } from '@nestjs/common';
import { RedisIoAdapter } from './relay/adapters/redis.adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  app.use(helmet());

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true
  }));

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  app.useWebSocketAdapter(new RedisIoAdapter(app));

  await app.listen(3001);
}

bootstrap();
