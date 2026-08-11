import { integer, pgTable, varchar, text } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  age: integer().notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
});

export const regions = pgTable("regions", {
  regions_id: integer().primaryKey().generatedAlwaysAsIdentity(),
  regions_name: text().notNull().unique(),
  regions_population: integer(),
});

export const cities = pgTable("cities", {
  cities_id: integer().primaryKey().generatedAlwaysAsIdentity(),
  cities_name: text().notNull(),
  cities_population: integer(),
  region: text().references(() => regions.regions_name),
});
