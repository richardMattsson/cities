import { pool } from "../config/database.ts";

async function selectAll() {
  const cities = await pool.query("select * from cities");
  return cities;
}

async function selectOne(id: number) {
  const cities = await pool.query("select * from cities where cities_id = $1", [
    id,
  ]);
  return cities;
}

async function innerJoinCities(region: string) {
  const cities = await pool.query(
    "select cities_id, cities_name, regions_name from cities inner join regions on cities.region = regions.regions_name where regions_name = $1",
    [region],
  );
  return cities;
}

async function insertCity(name: string, population: number, region: string) {
  const city = await pool.query(
    "insert into cities (cities_name, cities_population, region) values ($1, $2, $3) returning *",
    [name, population, region],
  );
  return city;
}

async function updateCity_service(
  name: string,
  population: number,
  region: string,
  id: number,
) {
  const result = await pool.query(
    "update cities set cities_name = $1, cities_population = $2, region = $3 where cities_id = $4 returning *",
    [name, population, region, id],
  );

  return result;
}

async function deleteCity_service(id: number) {
  const result = await pool.query(
    "delete from cities where cities_id = $1 returning *",
    [id],
  );
  return result;
}
export {
  selectAll,
  selectOne,
  innerJoinCities,
  insertCity,
  updateCity_service,
  deleteCity_service,
};
