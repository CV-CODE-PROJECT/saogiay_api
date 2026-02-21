import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('app.port') ?? 3000;
  await app.listen(port);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, //remove the field don't be defined
    forbidNonWhitelisted: true, // show error if see any another field
    transform: true, // auto format type
  }));
}
bootstrap();
