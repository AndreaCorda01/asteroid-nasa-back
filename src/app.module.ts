import { Module } from '@nestjs/common';
import { AsteroidsModule } from './modules/asteroids/asteroids.module';

@Module({
  imports: [AsteroidsModule],
})
export class AppModule {}
