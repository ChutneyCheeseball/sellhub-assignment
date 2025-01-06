import { FastifyReply, FastifyRequest } from "fastify";
import { databaseError, notFoundError } from "../responses";
import { database } from "../db";
import { eq } from "drizzle-orm";
import { products } from "../db/schema";
import { productExists } from "../db/productExists";

// =============================================================================
// Handler to order a product
// =============================================================================

export const orderProduct = async (
  request: FastifyRequest<{
    Body: { id: string; count: number };
  }>,
  reply: FastifyReply
) => {
  try {
    const { id, count } = request.body;
    if (!(await productExists(id))) {
      // Abort if product doesn't exist
      reply.code(404).send(notFoundError);
      return;
    }
    // Check stock of this product
    const result = await database
      .select({ inventory_count: products.inventory_count })
      .from(products)
      .where(eq(products.id, id));
    const { inventory_count } = result[0];
    // Are there enough products in inventory to satisfy this order?
    if (inventory_count < count) {
      reply.code(400).send({
        ok: false,
        message: `Order count (${count}) exceeds inventory count (${inventory_count})`,
      });
      return;
    }
    // Update product inventory_count
    await database
      .update(products)
      .set({ inventory_count: inventory_count - count })
      .where(eq(products.id, id));
    reply.send({ ok: true, message: `Ordered ${count} product(s)` });
  } catch (e) {
    reply.code(500).send(databaseError);
  }
};
