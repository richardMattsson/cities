import { pool } from "../config/database.ts";

async function selectAll() {
  const cities = await pool.query("select * from cities");
  return cities;
}

async function selectOne(id: number) {
  const cities = await pool.query("select * from cities where id = $1", [id]);
  return cities;
}

async function insertCity(name: string, population: number, region: string) {
  const city = await pool.query(
    "insert into cities (name, population, region) values ($1, $2, $3) returning *",
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
    "update cities set name = $1, population = $2, region = $3 where id = $4 returning *",
    [name, population, region, id],
  );

  return result;
}

async function deleteCity_service(id: number) {
  const result = await pool.query(
    "delete from cities where id = $1 returning *",
    [id],
  );
  return result;
}
export {
  selectAll,
  selectOne,
  insertCity,
  updateCity_service,
  deleteCity_service,
};
