import { FastifyReply, FastifyRequest } from "fastify";

// =============================================================================
// Simple handler for verifying status of our server
// Send { ok: true } if server is running
// =============================================================================

export const getStatus = (_: FastifyRequest, reply: FastifyReply) => {
  reply.send({ ok: true });
};
