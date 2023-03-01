import { Test, TestingModule } from '@nestjs/testing'
import { AsteroidsController } from './asteroids.controller'
import { AsteroidsService } from './asteroids.service';
import { AsteroidProxy, IAsteroidProxy } from './asteroids.proxy';
import { Asteroid } from '@entities/asteroid.entity';

import asteroid_detail_json from "./test/asteroid-detail.json"
import asteroids_list_json from "./test/asteroid-list.json"
import { HttpModule } from '@nestjs/axios';


class MockAsteroidProxy extends AsteroidProxy implements IAsteroidProxy  {
  getAsteroidListFromAPI(from: Date, to: Date, apiKey: string): Promise<Asteroid[]> {
    return new Promise( (resolve) => {
      setTimeout(
        () => resolve(this.parseAsteroidListResponse(asteroids_list_json)),
        250)
    } )
  }
  getAsteroidDetailsFromAPI(id: number, apiKey: string): Promise<Asteroid> {
    return new Promise( (resolve, _) => {
      setTimeout(
        () => resolve(this.parseAsteroidDetailResponse(asteroid_detail_json)),
        250)
    } )
  }
}


describe('AppController', () => {
  let asteroidsController: AsteroidsController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AsteroidsController],
      providers: [AsteroidsService, AsteroidProxy],
      imports: [HttpModule],
    })
    .overrideProvider(AsteroidProxy).useClass(MockAsteroidProxy)
    .compile();

    asteroidsController = app.get<AsteroidsController>(AsteroidsController)
  });

  describe('Asteroid Listing', () => {
    it('Should return the list of all asteroid in the json file', async () => {
      const asteroids = await asteroidsController.list({start_date: new Date("2023-01-01"), end_date: new Date("2023-01-02")})
      expect(asteroids).toBeInstanceOf(Array<Asteroid>)
      expect(asteroids).toHaveLength(25)
    });

    it('Should return the list of all asteroid in the json file filtered by name JR5', async () => {
      const search = "JR5"
      const asteroids = await asteroidsController.list({start_date: new Date("2023-01-01"), end_date: new Date("2023-01-02"), search })
      expect(asteroids).toHaveLength(1)
      expect(asteroids[0]).toHaveProperty("name")
      expect(asteroids[0].name).toContain(search)
    })

    it('Should return the list of all asteroid in the json file ordinated in ASC direction', async () => {
      const asteroids = await asteroidsController.list({start_date: new Date("2023-01-01"), end_date: new Date("2023-01-02") })
      expect(asteroids).toHaveLength(25)
      asteroids.reduce( (curr: Asteroid, acc: Asteroid) => {
          // Check if two elements are sorted ascendently
          expect(curr.name <= acc.name).toBe(true)
          return acc
      }, asteroids[0])
    })

    it('Should return the list of all asteroid in the json file ordinated in DESC direction', async () => {
      const asteroids = await asteroidsController.list({start_date: new Date("2023-01-01"), end_date: new Date("2023-01-02"), sort: "DESC" })
      expect(asteroids).toHaveLength(25)
      asteroids.reduce( (curr: Asteroid, acc: Asteroid) => {
          // Check if two elements are sorted descendently
          expect(curr.name >= acc.name).toBe(true)
          return acc
      }, asteroids[0])
    })
  });
});
