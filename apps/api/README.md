# API Microservice

This is the NodeJS Fastify microservice for reading/writing a PostgreSQL database.

The app was created manually and not bootstrapped with any tools.

The service runs on port 3002.

## Dependencies

- `dotenv` - for loading environment variables
- `drizzle-orm` - database ORM
- `fastify` - server framework for NodeJS
- `@fastify/cors` - CORS plugin for fastify
- `@neondatabase/serverless` - Neon's PostgreSQL driver

## Development Dependencies

- `@types/node` - NodeJS types
- `drizzle-kit` - for generating and running SQL files
- `ts-node-dev` - to run the app during development
- `typescript` - transpile TypeScript to JavaScript

## Scripts

- `npm run build` - build the microservice (output folder is `build`)
- `npm start` - run the built microservice
- `npm run dev` - start the microservice in development mode
- `npm test` - run comprehensive tests against endpoints (requires server to be running)
- `npm run db:generate` - generate SQL files with Drizzle
- `npm run db:migrate` - migrate SQL files to database

## API Endpoints

### `GET /status`

Test endpoint used to verify that the server is running.

**Sample request**

$ `curl http://localhost:3002/status`

**Sample response**

```
{ "ok": true }
```

---

### `GET /test`

Test endpoint to verify the connection to the Postgres database. Returns a timestamp from the database.

**Sample request**

$ `curl http://localhost:3002/test`

**Sample response**

```
{ "ok": true, "timestamp": "2025-01-06 19:03:11.426352+00" }
```

---

### `GET /products`

Return a listing of all the items in the `products` table in the database.

**Sample request**

$ `curl http://localhost:3002/products`

**Sample response**

```
[
    {
        "id": "d960d851-56db-4571-b75d-26d5a201c6dc",
        "name": "T-Shirts (L)",
        "inventory_count": 3
    },
    {
        "id": "6a58a24d-492f-41ca-9f88-ab63fe2c3e12",
        "name": "T-Shirts (M)",
        "inventory_count": 4
    },
    {
        "id": "bcf42ae2-8f24-4d04-b3a5-77bd085dc40e",
        "name": "T-Shirts (XL)",
        "inventory_count": 5
    },
    {
        "id": "115322f6-c8bc-4136-9465-b19e3bb1594e",
        "name": "Converse Sneakers (Red)",
        "inventory_count": 0
    },
    {
        "id": "3be5cd0c-e01d-4803-b1e8-21104da48ad7",
        "name": "Converse Sneakers (White)",
        "inventory_count": 2
    }
]
```

---

### `GET /products/<id>`

Retrieve a specific product by its ID.

**Sample request**

$ `curl http://localhost:3002/products/115322f6-c8bc-4136-9465-b19e3bb1594e`

**Sample response**

```
{
    "id": "115322f6-c8bc-4136-9465-b19e3bb1594e",
    "name": "Converse Sneakers (Red)",
    "inventory_count": 0
}
```

---

### `POST /products/<id>`

Update the inventory count of a product.

Payload is `{ "inventory_count": <integer> }`

**Sample request**

$ `curl -X POST http://localhost:3002/products/115322f6-c8bc-4136-9465-b19e3bb1594e -d '{ "inventory_count": 20 }' -H "Content-Type: application/json"`

**Sample response**

```
{
    "ok": true,
    "message": "Product updated"
}
```

---

### `POST /orders`

Place an order for a product, and subtract the order count from the inventory count.

Payload is `{ "id": <uuid>, "count": <integer>}`

**Sample request**

$ `curl -X POST http://localhost:3002/orders -d '{ "id": "115322f6-c8bc-4136-9465-b19e3bb1594e", "count": 1 }' -H "Content-Type: application/json"`

**Sample response**

```
{
    "ok": true,
    "message": "Ordered 1 product(s)",
    "remaining": 19
}
```

## Testing

As most of the work resides in HTTP handlers, testing is done by performing GET and POST requests against the endpoints. The microservice needs to be running for the tests to work.

Note that as part of the tests, product data in the database is changed. In a real-world scenario this would require a specific product to be flagged as a test product, but for the purposes of this assignment changing a "regular" product should be fine.

## Concerning Fastify

The Fastify framework was chosen because I am already familiar with it. It provides validation of the endpoint routes and payloads, and automatically shows error messages for e.g. the following scenarios.

- unknown routes
- malformed UUIDs for product IDs
- invalid payload datatypes (e.g. string was provided when integer was expected)
- payload validation failed (e.g. trying to order 0 products, or trying to update stock to a negative number)

The other error messages, such as 404s for wrong product ID, are handled manually.
