import Fastify from "fastify";
import { getProduct, getProducts, getStatus, testDatabase } from "./handlers";
import { updateProductInventory } from "./handlers/updateProductInventory";
import { routeHasIdSchema } from "./schema/routeHasIdSchema";
import { updateInventorySchema } from "./schema/updateInventorySchema";

// =============================================================================
// Main Application
// =============================================================================

async function main() {
  const fastify = Fastify({ ignoreTrailingSlash: true });

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

  fastify.get("/products/:id", { schema: routeHasIdSchema }, getProduct);
  fastify.get("/products", getProducts);
  fastify.post(
    "/products/:id",
    { schema: updateInventorySchema },
    updateProductInventory
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
