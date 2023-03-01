import { AsteroidsController } from '@modules/asteroids/asteroids.controller';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { AsteroidProxy } from './asteroids.proxy';
import { AsteroidsService } from './asteroids.service';

@Module({
  imports: [HttpModule],
  providers: [AsteroidProxy, AsteroidsService],
  controllers: [AsteroidsController]
})
export class AsteroidsModule {}
