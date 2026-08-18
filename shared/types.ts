export interface Region {
  regions_id: number;
  regions_name: string;
  regions_population: number | string;
}

export interface Municipality {
  municipalities_id: number;
  municipalities_name: string;
  municipalities_population: number | string;
  region: string;
}

export interface City {
  cities_id: number;
  cities_name: string;
  cities_population: number | string;
  municipality: string;
}
