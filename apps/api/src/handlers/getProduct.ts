import { FastifyReply, FastifyRequest } from "fastify";
import { database } from "../db";
import { products } from "../db/schema";
import { eq } from "drizzle-orm";
import { databaseError, notFoundError } from "../responses";

// =============================================================================
// Handler to retrieve a single product by ID
// =============================================================================

export const getProduct = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  const { id } = request.params;
  try {
    const result = await database
      .select()
      .from(products)
      .where(eq(products.id, id));
    // Was the item found in the database?
    if (result.length === 0) {
      reply.code(404).send(notFoundError); // Nope
    } else {
      reply.send(result[0]); // Yep
    }
  } catch (e) {
    console.error(e);
    reply.code(500).send(databaseError);
  }
};
