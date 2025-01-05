import { FastifyReply, FastifyRequest } from "fastify";
import { database } from "../db";
import { products } from "../db/schema";
import { eq } from "drizzle-orm";

export const getProductById = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  const { id } = request.params;
  try {
    const result = await database
      .select()
      .from(products)
      .where(eq(products.id, id));
    console.log(result, "<==");
  } catch (e) {
    console.error(e);
  }

  reply.send("Hello" + id);
};
