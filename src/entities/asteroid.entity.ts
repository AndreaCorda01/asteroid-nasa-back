import { BaseEntity } from "./baseEntity"

export class Asteroid extends BaseEntity {

  public constructor(init?: Partial<Asteroid>) {
    super()
    Object.assign(this, init);
  }
  
  name: string
  estimated_diameter_meter_max: number
  estimated_diameter_meter_min: number
  is_potentially_hazardous_asteroid?: boolean

  close_approach_data?: CloseApproachData[]
}

export interface CloseApproachData {
  close_approach_date: string
	relative_velocity: {
    kilometers_per_second: number
    kilometers_per_hour:	number
    miles_per_hour:	number
  }

	miss_distance: {
    astronomical:	number
    lunar:	number
    kilometers:	number
    miles:	number
  }
  orbiting_body: string
}