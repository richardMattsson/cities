import { integer, pgTable, text } from "drizzle-orm/pg-core";

export const regions = pgTable("regions", {
  regions_id: integer().primaryKey().generatedAlwaysAsIdentity(),
  regions_name: text().notNull().unique(),
  regions_population: integer(),
});

export const municipalities = pgTable("municipalities", {
  municipalities_id: integer().primaryKey().generatedAlwaysAsIdentity(),
  municipalities_name: text().notNull().unique(),
  municipalities_population: integer(),
  region_id: integer().references(() => regions.regions_id, {
    onDelete: "cascade",
    onUpdate: "cascade",
  }),
});

export const cities = pgTable("cities", {
  cities_id: integer().primaryKey().generatedAlwaysAsIdentity(),
  cities_name: text().notNull(),
  cities_population: integer(),
  municipality_id: integer().references(
    () => municipalities.municipalities_id,
    {
      onDelete: "cascade",
      onUpdate: "cascade",
    },
  ),
});
