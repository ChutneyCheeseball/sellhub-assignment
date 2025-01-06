// Body must have non-negative 'count' as well as product id
export const orderProductSchema = {
  body: {
    type: "object",
    required: ["count", "id"],
    properties: {
      count: {
        type: "integer",
        minimum: 1, // Must order at least one product
      },
      id: {
        type: "string",
        format: "uuid",
      },
    },
  },
};
