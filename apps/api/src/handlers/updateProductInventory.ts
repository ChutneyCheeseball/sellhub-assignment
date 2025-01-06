import { FastifyReply, FastifyRequest } from "fastify";
import { databaseError, notFoundError } from "../responses";
import { database } from "../db";
import { eq, count } from "drizzle-orm";
import { products } from "../db/schema";
import { productExists } from "../db/productExists";

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
    if (!(await productExists(id))) {
      // Abort if product doesn't exist
      reply.code(404).send(notFoundError);
      return;
    }
    // Update it if it does exist
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
