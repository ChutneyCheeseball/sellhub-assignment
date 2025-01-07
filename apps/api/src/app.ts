import { buildServer } from "./server";

// =============================================================================
// Main Application
// =============================================================================

function main() {
  const fastify = buildServer();

  // ---------------------------------------------------------------------------
  // Start the server
  // ---------------------------------------------------------------------------

  fastify.listen({ port: 3002 }, (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Server listening at ${address}`);
  });
}

main();
