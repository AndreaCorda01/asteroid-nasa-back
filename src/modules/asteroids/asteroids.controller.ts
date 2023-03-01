import { SortType, AsteroidsService } from './asteroids.service';
import { Controller, Get, Param, Query } from '@nestjs/common';


import { IsDateString, IsIn, IsNumberString, IsOptional, IsString, Min } from 'class-validator';

export class AsteroidDetailsQueryParams {
  @IsNumberString()
  id: number
}

export class AsteroidListQueryParams {
  @IsDateString()
  start_date: Date

  @IsDateString()
  end_date: Date

  @IsOptional()
  @IsString()
  search?: string

  @IsOptional()
  @IsString()
  @IsIn([ "ASC", "DESC"])
  sort?: string
}




@Controller("asteroid")
export class AsteroidsController {
  constructor( private readonly asteroidService: AsteroidsService) { }

  @Get("list")
  async list(@Query() params: AsteroidListQueryParams) {
    const { start_date, end_date, sort, search } = params
    const asteroids = await this.asteroidService.list(start_date, end_date, sort as SortType, search)
    return asteroids
  }

  @Get("details/:id")
  async get(@Param() params: AsteroidDetailsQueryParams) {
    const { id } = params
    return await this.asteroidService.get(id)
  }
 
}