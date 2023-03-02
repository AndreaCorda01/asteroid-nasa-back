import { Injectable, NotFoundException } from '@nestjs/common';
import { Asteroid, CloseApproachData } from '@entities/asteroid.entity';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import dayjs from 'dayjs';

export interface IAsteroidProxy {
  getAsteroidListFromAPI(from: Date, to: Date): Promise<Asteroid[]>;
  getAsteroidDetailsFromAPI(id: number): Promise<Asteroid | null>;
}

@Injectable()
export class AsteroidProxy implements IAsteroidProxy {
  private readonly URL_LIST = 'https://api.nasa.gov/neo/rest/v1/feed';
  private readonly URL_DETAILS = 'https://api.nasa.gov/neo/rest/v1/neo/';
  private readonly API_KEY = 'k6YX6dO9ditrvI7Euo37AalYXifRItjAZWLsBQ1a';

  constructor(private readonly httpService: HttpService) {}

  /**
   * Make a request to NASA Asteroids endpoint to retrieve the list of asteroids approached to the earth.
   *
   * @param from - The start date filter
   * @param to - The end date filter
   * @returns Return an Array of `Asteroid` already parsed from the raw response
   *
   */
  async getAsteroidListFromAPI(from: Date, to: Date): Promise<Asteroid[]> {
    const { data } = await firstValueFrom(
      this.httpService
        .get<any>(this.URL_LIST, {
          params: {
            start_date: dayjs(from).format('YYYY-MM-DD'),
            end_date: dayjs(to).format('YYYY-MM-DD'),
            api_key: this.API_KEY,
          },
        })
        .pipe(
          catchError((error: AxiosError) => {
            if (error.response.status == 404)
              throw new NotFoundException(`Not found`);
            else throw 'An error occured calling external APIs';
          }),
        ),
    );

    return this.parseAsteroidListResponse(data);
  }

  /**
   * Make a request to NASA Asteroids endpoint to retrieve the details of a specific asteroid.
   *
   * @param from - The start date filter
   * @param to - The end date filter
   * @returns Return an Array of `Asteroid` already parsed from the raw response
   *
   */
  async getAsteroidDetailsFromAPI(id: number): Promise<Asteroid | null> {
    const { data } = await firstValueFrom(
      this.httpService
        .get<Asteroid>(`${this.URL_DETAILS}${id}`, {
          params: {
            api_key: this.API_KEY,
          },
        })
        .pipe(
          catchError((error: AxiosError) => {
            if (error.response.status == 404)
              throw new NotFoundException(`Not found  with id: ${id}.`);
            else throw 'An error occured calling external APIs';
          }),
        ),
    );
    return this.parseAsteroidDetailResponse(data);
  }

  protected parseAsteroidListResponse(data: any): Asteroid[] {
    const dates = Object.keys(data.near_earth_objects);
    const asteroids = [];
    dates.forEach((date: string) => {
      data.near_earth_objects[date].map((raw_item: any) =>
        asteroids.push(
          new Asteroid({
            id: raw_item.id,
            name: raw_item.name,
            estimated_diameter_meter_max:
              raw_item.estimated_diameter.meters.estimated_diameter_max,
            estimated_diameter_meter_min:
              raw_item.estimated_diameter.meters.estimated_diameter_min,
          }),
        ),
      );
    });
    return asteroids;
  }

  protected parseAsteroidDetailResponse(data: any): Asteroid {
    const asteroid = new Asteroid({
      id: data.id,
      name: data.name,
      estimated_diameter_meter_max:
        data.estimated_diameter.meters.estimated_diameter_max,
      estimated_diameter_meter_min:
        data.estimated_diameter.meters.estimated_diameter_min,
      close_approach_data: [],
    });
    data.close_approach_data.map((line: any) => {
      const item: CloseApproachData = {
        close_approach_date: line.close_approach_date,
        relative_velocity: {
          kilometers_per_second: line.relative_velocity.kilometers_per_second,
          kilometers_per_hour: line.relative_velocity.kilometers_per_hour,
          miles_per_hour: line.relative_velocity.miles_per_hour,
        },
        miss_distance: {
          astronomical: line.miss_distance.astronomical,
          lunar: line.miss_distance.lunar,
          kilometers: line.miss_distance.kilometers,
          miles: line.miss_distance.miles,
        },
        orbiting_body: line.orbiting_body,
      };
      asteroid.close_approach_data.push(item);
    });
    return asteroid;
  }
}
