import { pool } from "../config/database.ts";

export const getCities = async () => {
  const result = await pool.query(`
        SELECT cities_id, cities_name, cities_population
        FROM cities
        ORDER BY cities_name;
    `);

  return result.rows;
};
