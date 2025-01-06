import Fastify from "fastify";
import {
  getProduct,
  getProducts,
  getStatus,
  updateProductInventory,
  orderProduct,
  testDatabase,
} from "./handlers";
import {
  routeHasIdSchema,
  updateInventorySchema,
  orderProductSchema,
} from "./schema";

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

  // Get product(s)
  fastify.get("/products/:id", { schema: routeHasIdSchema }, getProduct);
  fastify.get("/products", getProducts);

  // Update product inventory (dashboard)
  fastify.post(
    "/products/:id",
    { schema: updateInventorySchema },
    updateProductInventory
  );

  // Order a product (store)
  fastify.post("/orders", { schema: orderProductSchema }, orderProduct);

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
