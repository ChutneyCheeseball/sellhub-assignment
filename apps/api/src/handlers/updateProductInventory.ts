import { FastifyReply, FastifyRequest } from "fastify";
import { databaseError, notFoundError } from "../responses";
import { database } from "../db";
import { eq, count } from "drizzle-orm";
import { products } from "../db/schema";

// =============================================================================
// Handler to update the inventory of a single product by ID
// =============================================================================

export const updateProductInventory = async (
  request: FastifyRequest<{
    Params: { id: string };
    Body: { inventory_count: number };
  }>,
  reply: FastifyReply
) => {
  try {
    const { id } = request.params;
    // Check if this product exists in the database
    const result = await database
      .select({ count: count() })
      .from(products)
      .where(eq(products.id, id));
    // Abort if it doesn't
    if (result[0].count === 0) {
      reply.code(404).send(notFoundError);
      return;
    }
    // Update if it does
    const { inventory_count } = request.body;
    await database
      .update(products)
      .set({ inventory_count })
      .where(eq(products.id, id));
    reply.send({ ok: true, message: "Product updated" });
  } catch (e) {
    console.error(e);
    reply.code(500).send(databaseError);
  }
};
