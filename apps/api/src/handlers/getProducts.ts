import { FastifyReply, FastifyRequest } from "fastify";
import { database } from "../db";
import { products } from "../db/schema";
import { databaseError } from "../responses";

// =============================================================================
// Handler to return complete product listing array
// =============================================================================

export const getProducts = async (_: FastifyRequest, reply: FastifyReply) => {
  try {
    const result = await database.select().from(products);
    reply.send(result);
  } catch (e) {
    console.error(e);
    reply.code(500).send(databaseError);
  }
};
