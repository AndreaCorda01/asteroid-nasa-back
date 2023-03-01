import { Asteroid } from "@entities/asteroid.entity";
import { Injectable } from "@nestjs/common";
import { AsteroidProxy } from "./asteroids.proxy";

export type SortType = "ASC"|"DESC"
const API_KEY = "DEMO_API"

@Injectable()
export class AsteroidsService {

  constructor(private readonly asteroidProxy: AsteroidProxy) { }

  async list(from: Date, to: Date, sort: SortType, search?: string): Promise<Asteroid[]>{
    let asteroids = await this.asteroidProxy.getAsteroidListFromAPI(from, to, API_KEY)
    // MANUAL SORTING AND FILTERING
    if(search != null) {
      asteroids = asteroids.filter(item => item.name.includes(search))
    }
    asteroids = asteroids.sort( (a, b) => {
      if(sort == "DESC") {
        return a.name < b.name ? 1 : -1
      } else return a.name > b.name ? 1 : -1
    })
    return asteroids

  }

  async get(id: number): Promise<Asteroid|null> {
    const asteroid = await this.asteroidProxy.getAsteroidDetailsFromAPI(id, API_KEY)
    return asteroid
  }

}