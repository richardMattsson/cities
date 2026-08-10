import { pool } from "../config/database.ts";

async function selectAll() {
  const regions = await pool.query("select * from regions");
  return regions;
}

async function selectOne(id: number) {
  const region = await pool.query("select * from regions where id = $1", [id]);
  return region;
}

async function insertRegion(name: string, population: number) {
  const city = await pool.query(
    "insert into regions (name, population) values ($1, $2) returning *",
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
    "update regions set name = $1, population = $2 where id = $3 returning *",
    [name, population, id],
  );

  return result;
}

async function deleteRegion_service(id: number) {
  const result = await pool.query(
    "delete from regions where id = $1 returning *",
    [id],
  );
  return result;
}
export {
  selectAll,
  selectOne,
  insertRegion,
  updateRegion_service,
  deleteRegion_service,
};
