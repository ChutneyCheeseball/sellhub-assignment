import Fastify from "fastify";
import {
  getProductById,
  getProducts,
  getStatus,
  testDatabase,
} from "./handlers";

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

  fastify.get("/status", getStatus); // Verify server is running
  fastify.get("/test", testDatabase); // Verify DB connection

  // ---------------------------------------------------------------------------
  // Product routes
  // ---------------------------------------------------------------------------

  fastify.get("/products", getProducts);
  fastify.get(
    "/products/:id",
    {
      schema: {
        params: {
          type: "object",
          required: ["id"],
          properties: {
            id: { type: "string" },
          },
        },
      },
    },
    getProductById
  );

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
