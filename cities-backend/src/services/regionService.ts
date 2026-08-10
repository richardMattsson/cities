import { pool } from "../config/database.ts";

async function selectAll() {
  const regions = await pool.query("select * from regions");
  return regions;
}

async function selectOne(id: number) {
  const region = await pool.query(
    "select * from regions where regions_id = $1",
    [id],
  );
  return region;
}

async function innerJoinCities(id: number) {
  const cities = await pool.query(
    "select cities_id, cities_name, regions_name from cities inner join regions on cities.region = regions.regions_name where regions_id = $1",
    [id],
  );
  return cities;
}

async function insertRegion(name: string, population: number) {
  const city = await pool.query(
    "insert into regions (regions_name, regions_population) values ($1, $2) returning *",
    [name, population],
  );
  return city;
}

async function updateRegion_service(
  name: string,
  population: number,
  id: number,
) {
  const result = await pool.query(
    "update regions set regions_name = $1, regions_population = $2 where regions_id = $3 returning *",
    [name, population, id],
  );

  return result;
}

async function deleteRegion_service(id: number) {
  const result = await pool.query(
    "delete from regions where regions_id = $1 returning *",
    [id],
  );
  return result;
}
export {
  selectAll,
  selectOne,
  innerJoinCities,
  insertRegion,
  updateRegion_service,
  deleteRegion_service,
};
