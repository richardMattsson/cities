import { pool } from "../config/database.ts";

async function selectAll() {
  const cities = await pool.query("select * from cities");
  return cities;
}

async function selectOne(id: number) {
  const cities = await pool.query("select * from cities where id = $1", [id]);
  return cities;
}

async function insertCity(name: string, population: number) {
  const city = await pool.query(
    "insert into cities (name, population) values ($1, $2) returning *",
    [name, population],
  );
  return city;
}

async function updateCity_service(
  name: string,
  population: number,
  id: number,
) {
  const result = await pool.query(
    "update cities set name = $1, population = $2 where id = $3 returning *",
    [name, population, id],
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
