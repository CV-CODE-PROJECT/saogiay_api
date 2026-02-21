import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Config enviroment
  const configService = app.get(ConfigService);
  const port = configService.get<number>('app.port') ?? 3000;
  const env = configService.get<string>('app.env');
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, //remove the field don't be defined
    forbidNonWhitelisted: true, // show error if see any another field
    transform: true, // auto format type
  }));

  
  // Config swagger
  if(env != 'production'){
    const config = new DocumentBuilder()
      .setTitle('NestJS Boilerplate API')
      .setDescription('Document API for Boilerplate')
      .setVersion('1.0')
      .addBearerAuth() 
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('swagger', app, document);
  }

  // run app
  await app.listen(port);
}
bootstrap();
