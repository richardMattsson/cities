import { eq } from "drizzle-orm";
import { db } from "../db/index.ts";
import { cities, municipalities } from "../db/schema.ts";

async function getMunicipalities() {
  const response = await db
    .select()
    .from(municipalities)
    .orderBy(municipalities.municipalities_name);
  return response;
}

async function getOneMunicipality(id: number) {
  const response = await db
    .select()
    .from(municipalities)
    .where(eq(municipalities.municipalities_id, id));
  return response;
}

async function sumOfMunicipalities() {
  const response = await db.$count(municipalities);
  return response;
}

async function getCitiesFromMunicipality(id: number) {
  const response = await db
    .select({
      cities_id: cities.cities_id,
      cities_name: cities.cities_name,
      municipalities_name: municipalities.municipalities_name,
    })
    .from(cities)
    .innerJoin(
      municipalities,
      eq(cities.municipality_id, municipalities.municipalities_id),
    )
    .where(eq(municipalities.municipalities_id, id))
    .orderBy(cities.cities_name);
  return response;
}

async function postMunicipality(
  name: string,
  population: number,
  region_id: number,
) {
  const response = await db
    .insert(municipalities)
    .values({
      municipalities_name: name,
      municipalities_population: population,
      region_id,
    })
    .returning();
  return response;
}

async function updateMunicipality(
  name: string,
  population: number,
  region_id: number,
  id: number,
) {
  const response = await db
    .update(municipalities)
    .set({
      municipalities_name: name,
      municipalities_population: population,
      region_id,
    })
    .where(eq(municipalities.municipalities_id, id))
    .returning();

  return response;
}

async function deleteMunicipality(id: number) {
  const result = await db
    .delete(municipalities)
    .where(eq(municipalities.municipalities_id, id))
    .returning();
  return result;
}
export {
  getMunicipalities,
  getOneMunicipality,
  sumOfMunicipalities,
  getCitiesFromMunicipality,
  postMunicipality,
  updateMunicipality,
  deleteMunicipality,
};
