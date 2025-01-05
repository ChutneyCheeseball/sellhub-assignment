import { FastifyReply, FastifyRequest } from "fastify";
import { database } from "../db";

// A simple handler for testing the database connection
// Returns { ok: true, timestamp: <timestamp> } on success
// Returns { ok: false } on database failure

export const testDatabase = async (_: FastifyRequest, reply: FastifyReply) => {
  try {
    const result = await database.execute("SELECT now() AS timestamp");
    const { timestamp } = result.rows[0];
    console.log("Database test OK", timestamp);
    reply.send({ ok: true, timestamp });
  } catch (e) {
    console.error("Database test error", e);
    reply.code(500).send({ ok: false });
  }
};
