import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import appConfig from './app.config';
import { envValidationSchema } from './config/env.validation';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    load: [appConfig],
    envFilePath: ['.env.development', '.env.production'],
    validationSchema: envValidationSchema,
    validationOptions: {
      allowUnknown: true,
      abortEarly: true,
    },
  })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
