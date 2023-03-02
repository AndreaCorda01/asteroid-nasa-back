import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AsteroidsModule } from './modules/asteroids/asteroids.module';

@Module({
  imports: [AsteroidsModule, ConfigModule.forRoot(),],
})
export class AppModule {}
