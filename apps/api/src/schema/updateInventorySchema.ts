import { routeHasIdSchema } from "./routeHasIdSchema";

// Route has id and body must have non-negative 'inventory_count'
export const updateInventorySchema = {
  ...routeHasIdSchema,
  body: {
    type: "object",
    required: ["inventory_count"],
    properties: {
      inventory_count: {
        type: "integer",
        minimum: 0, // Enforce that inventory_count must be >= 0
      },
    },
  },
};
