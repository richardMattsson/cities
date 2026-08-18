import { eq } from "drizzle-orm";
import { db } from "../db/index.ts";
import { cities, regions } from "../db/schema.ts";

async function getRegions() {
  const response = await db
    .select()
    .from(regions)
    .orderBy(regions.regions_name);
  return response;
}

async function getOneRegionAPI(id: number) {
  const response = await db
    .select()
    .from(regions)
    .where(eq(regions.regions_id, id));
  return response;
}

async function sumOfRegions() {
  const response = await db.$count(regions);
  return response;
}

async function getCitiesFromRegion(id: number) {
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

async function postRegion(name: string, population: number) {
  const response = await db
    .insert(regions)
    .values({ regions_name: name, regions_population: population })
    .returning();
  return response;
}

async function updateRegion(name: string, population: number, id: number) {
  const response = await db
    .update(regions)
    .set({ regions_name: name, regions_population: population })
    .where(eq(regions.regions_id, id))
    .returning();

  return response;
}

async function deleteRegion(id: number) {
  const response = await db
    .delete(regions)
    .where(eq(regions.regions_id, id))
    .returning();

  return response;
}
export {
  getRegions,
  getOneRegionAPI,
  sumOfRegions,
  getCitiesFromRegion,
  postRegion,
  updateRegion,
  deleteRegion,
};
