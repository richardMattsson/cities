import { eq } from "drizzle-orm";
import { db } from "../db/index.ts";
import { cities } from "../db/schema.ts";

async function getCities() {
  const response = await db.select().from(cities).orderBy(cities.cities_name);
  return response;
}

async function getOneCity(id: number) {
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

async function postCity(
  name: string,
  population: number,
  municipality_id: number,
) {
  const response = await db
    .insert(cities)
    .values({
      cities_name: name,
      cities_population: population,
      municipality_id,
    })
    .returning();
  return response;
}

async function updateCity(
  name: string,
  population: number,
  municipality_id: number,
  id: number,
) {
  const response = await db
    .update(cities)
    .set({ cities_name: name, cities_population: population, municipality_id })
    .where(eq(cities.cities_id, id))
    .returning();

  return response;
}

async function deleteCity(id: number) {
  const result = await db
    .delete(cities)
    .where(eq(cities.cities_id, id))
    .returning();
  return result;
}
export { getCities, getOneCity, sumOfCities, postCity, updateCity, deleteCity };
