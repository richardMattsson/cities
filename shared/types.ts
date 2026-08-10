export interface City {
  cities_id: number;
  cities_name: string;
  cities_population: number | string;
  region: string;
}

export interface Region {
  regions_id: number;
  regions_name: string;
  regions_population: number | string;
}
