import { eq, count } from "drizzle-orm";
import { database } from ".";
import { products } from "./schema";

// =============================================================================
// Check if this product exists in the database
// =============================================================================

export const productExists = async (id: string) => {
  const result = await database
    .select({ count: count() })
    .from(products)
    .where(eq(products.id, id));
  return result[0].count > 0;
};
