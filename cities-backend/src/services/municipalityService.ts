import { eq } from "drizzle-orm";
import { db } from "../db/index.ts";
import { municipalities } from "../db/schema.ts";

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

async function postMunicipality(
  name: string,
  population: number,
  region: string,
) {
  const response = await db
    .insert(municipalities)
    .values({
      municipalities_name: name,
      municipalities_population: population,
      region,
    })
    .returning();
  return response;
}

async function updateMunicipality(
  name: string,
  population: number,
  region: string,
  id: number,
) {
  const response = await db
    .update(municipalities)
    .set({
      municipalities_name: name,
      municipalities_population: population,
      region,
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
  postMunicipality,
  updateMunicipality,
  deleteMunicipality,
};
