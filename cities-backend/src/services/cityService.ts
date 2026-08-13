import { eq } from "drizzle-orm";
import { db } from "../db/index.ts";
import { cities } from "../db/schema.ts";

async function selectAll() {
  const response = await db.select().from(cities).orderBy(cities.cities_name);
  return response;
}

async function selectOne(id: number) {
  const response = await db
    .select()
    .from(cities)
    .where(eq(cities.cities_id, id));
  return response;
}

async function sumOfCities() {
  const response = await db.$count(cities);
  return response;
}

async function insertCity(name: string, population: number, region: string) {
  const response = await db
    .insert(cities)
    .values({
      cities_name: name,
      cities_population: population,
      region,
    })
    .returning();
  return response;
}

async function updateCity_service(
  name: string,
  population: number,
  region: string,
  id: number,
) {
  const response = await db
    .update(cities)
    .set({ cities_name: name, cities_population: population, region })
    .where(eq(cities.cities_id, id))
    .returning();

  return response;
}

async function deleteCity_service(id: number) {
  const result = await db
    .delete(cities)
    .where(eq(cities.cities_id, id))
    .returning();
  return result;
}
export {
  selectAll,
  selectOne,
  sumOfCities,
  insertCity,
  updateCity_service,
  deleteCity_service,
};
