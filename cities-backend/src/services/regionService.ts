import { eq } from "drizzle-orm";
import { db } from "../db/index.ts";
import { cities, regions } from "../db/schema.ts";

async function selectAll() {
  const response = await db
    .select()
    .from(regions)
    .orderBy(regions.regions_name);
  return response;
}

async function selectOne(id: number) {
  const response = await db
    .select()
    .from(regions)
    .where(eq(regions.regions_id, id));
  return response;
}

async function innerJoinCities(id: number) {
  const response = await db
    .select({
      cities_id: cities.cities_id,
      cities_name: cities.cities_name,
      regions_name: regions.regions_name,
    })
    .from(cities)
    .innerJoin(regions, eq(cities.region, regions.regions_name))
    .where(eq(regions.regions_id, id))
    .orderBy(cities.cities_name);
  return response;
}

async function insertRegion(name: string, population: number) {
  const city = await db
    .insert(regions)
    .values({ regions_name: name, regions_population: population })
    .returning();
  return city;
}

async function updateRegion_service(
  name: string,
  population: number,
  id: number,
) {
  const result = await db
    .update(regions)
    .set({ regions_name: name, regions_population: population })
    .where(eq(regions.regions_id, id))
    .returning();

  return result;
}

async function deleteRegion_service(id: number) {
  const result = await db
    .delete(regions)
    .where(eq(regions.regions_id, id))
    .returning();

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
