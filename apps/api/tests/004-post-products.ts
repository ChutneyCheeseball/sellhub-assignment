import { describe, it } from "node:test";
import assert from "assert";

const endpoint = "products";

describe(`POST /${endpoint}/<malformed_uuid>`, () => {
  it(`POST /${endpoint}/<malformed_uuid> returns status 400 and error message`, async () => {
    const response = await fetch(`http://localhost:3002/${endpoint}/abcde`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inventory_count: 20,
      }),
    });
    assert.deepStrictEqual(response.status, 400);
    const j = await response.json();
    assert.deepStrictEqual(j.message, 'params/id must match format "uuid"');
  });
});

describe(`POST /${endpoint}/<invalid_uuid>`, () => {
  it(`POST /${endpoint}/<invalid_uuid> returns status 404 and error message`, async () => {
    const response = await fetch(
      `http://localhost:3002/${endpoint}/00000000-0000-0000-0000-000000000000`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inventory_count: 20,
        }),
      }
    );
    assert.deepStrictEqual(response.status, 404);
    const j = await response.json();
    assert.deepStrictEqual(j.message, "Product not found");
  });
});

const uuid = "115322f6-c8bc-4136-9465-b19e3bb1594e";
describe(`POST /${endpoint}/${uuid}`, () => {
  it(`POST /${endpoint}/${uuid} with invalid payload returns status 400 and error message`, async () => {
    const response = await fetch(`http://localhost:3002/${endpoint}/${uuid}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inventory_count: "invalid payload",
      }),
    });
    assert.deepStrictEqual(response.status, 400);
    const j = await response.json();
    assert.deepStrictEqual(j.message, "body/inventory_count must be integer");
  });
});

describe(`POST /${endpoint}/${uuid}`, () => {
  it(`POST /${endpoint}/${uuid} with negative inventory_count in payload returns status 400 and error message`, async () => {
    const response = await fetch(`http://localhost:3002/${endpoint}/${uuid}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inventory_count: -2,
      }),
    });
    assert.deepStrictEqual(response.status, 400);
    const j = await response.json();
    assert.deepStrictEqual(j.message, "body/inventory_count must be >= 0");
  });
});

describe(`POST /${endpoint}/${uuid}`, () => {
  it(`POST /${endpoint}/${uuid} with valid payload returns status 200 and success message`, async () => {
    const response = await fetch(`http://localhost:3002/${endpoint}/${uuid}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inventory_count: 20,
      }),
    });
    assert.deepStrictEqual(response.status, 200);
    const j = await response.json();
    assert.deepStrictEqual(j.message, "Product updated");
  });
});
