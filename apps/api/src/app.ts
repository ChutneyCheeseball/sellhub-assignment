import Fastify from "fastify";
import { getStatus, testDatabase } from "./handlers";

// =============================================================================
// Main Application
// =============================================================================

async function main() {
  const fastify = Fastify();

  // ---------------------------------------------------------------------------
  // Shutdown handlers and hooks
  // ---------------------------------------------------------------------------

  // Ctrl-C handler
  process.on("SIGINT", () => {
    console.log("Process interrupted");
    fastify.close().then(() => {
      process.exit(0);
    });
  });

  fastify.addHook("onClose", (_, done) => {
    console.log("Fastify is shutting down...");
    done();
  });

  // ---------------------------------------------------------------------------
  // Test routes
  // ---------------------------------------------------------------------------

  // Verify server is running
  fastify.get("/status", getStatus);

  // Verify DB connection
  fastify.get("/test", testDatabase);

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
