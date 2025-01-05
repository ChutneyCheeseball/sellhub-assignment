import { pgTable, uuid, varchar, integer } from "drizzle-orm/pg-core";

export const products = pgTable("products", {
  id: uuid().primaryKey().defaultRandom(),
  name: varchar().notNull(),
  inventory_count: integer().notNull().default(0),
});
