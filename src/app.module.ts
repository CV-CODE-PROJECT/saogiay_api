import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DocsController } from './docs.controller';
import { AuthModule } from './modules/auth/auth.module';
import { DatabaseModule } from './modules/database/database.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { ProductsModule } from './modules/products/products.module';

@Module({
  controllers: [DocsController],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    DatabaseModule,
    AuthModule,
    ProductsModule,
    InventoryModule,
  ],
})
export class AppModule {}
