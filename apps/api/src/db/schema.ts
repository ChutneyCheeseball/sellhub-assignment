import { sql } from "drizzle-orm";
import { pgTable, uuid, varchar, integer, check } from "drizzle-orm/pg-core";

export const products = pgTable(
  "products",
  {
    id: uuid().primaryKey().defaultRandom(),
    name: varchar().notNull(),
    inventory_count: integer().notNull().default(0),
  },
  // Enforce inventory_count being positive at database level
  // Documentation is wrong, se:e https://github.com/drizzle-team/drizzle-orm/issues/3520
  (table) => [check("inventory_check", sql`${table.inventory_count} >= 0`)]
);
