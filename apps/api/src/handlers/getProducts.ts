import { FastifyReply, FastifyRequest } from "fastify";
import { database } from "../db";
import { products } from "../db/schema";

export const getProducts = async (_: FastifyRequest, reply: FastifyReply) => {
  try {
    const result = await database.select().from(products);
    console.log(result, "<-- products");
    reply.send(result);
  } catch (e) {
    console.error(e);
    reply.send("Whoops");
  }
};
