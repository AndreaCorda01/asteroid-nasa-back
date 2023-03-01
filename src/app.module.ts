import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AsteroidsModule } from './modules/asteroids/asteroids.module';

@Module({
  imports: [AsteroidsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
