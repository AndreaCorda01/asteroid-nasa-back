import { Asteroid } from '@entities/asteroid.entity';
import { Injectable } from '@nestjs/common';
import { AsteroidProxy } from './asteroids.proxy';

export type SortType = 'ASC' | 'DESC';

@Injectable()
export class AsteroidsService {
  constructor(private readonly asteroidProxy: AsteroidProxy) {}

  /**
   * Returns the list of all asteroids.
   *
   * @param from - The start date filter
   * @param to - The end date filter
   * @param sort - Sort direction
   * @param search - Filter per asteroid name
   * @returns Return an Array of `Asteroid`
   *
   */
  async list(
    from: Date,
    to: Date,
    sort: SortType,
    search?: string,
  ): Promise<Asteroid[]> {
    let asteroids = await this.asteroidProxy.getAsteroidListFromAPI(from, to);
    // MANUAL SORTING AND FILTERING
    if (search != null) {
      asteroids = asteroids.filter((item) => item.name.includes(search));
    }
    asteroids = asteroids.sort((a, b) => {
      if (sort == 'DESC') {
        return a.name < b.name ? 1 : -1;
      } else return a.name > b.name ? 1 : -1;
    });
    return asteroids;
  }

  /**
   * Returns the details of an asteroid.
   *
   * @param id - Object ID
   * @returns Return an `Asteroid`
   *
   */
  async get(id: number): Promise<Asteroid | null> {
    const asteroid = await this.asteroidProxy.getAsteroidDetailsFromAPI(id);
    return asteroid;
  }
}
