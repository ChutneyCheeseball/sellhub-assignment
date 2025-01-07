import { describe, it } from "node:test";
import assert from "assert";

const endpoint = "orders";

describe(`POST /${endpoint}`, () => {
  it(`POST /${endpoint} with malformed id in payload returns status 400 and error message`, async () => {
    const response = await fetch(`http://localhost:3002/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: "abcde",
        count: 20,
      }),
    });
    assert.deepStrictEqual(response.status, 400);
    const j = await response.json();
    assert.deepStrictEqual(j.message, 'body/id must match format "uuid"');
  });
});

describe(`POST /${endpoint}`, () => {
  it(`POST /${endpoint} with invalid id in payload returns status 404 and error message`, async () => {
    const response = await fetch(`http://localhost:3002/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: "00000000-0000-0000-0000-000000000000",
        count: 20,
      }),
    });
    assert.deepStrictEqual(response.status, 404);
    const j = await response.json();
    assert.deepStrictEqual(j.message, "Product not found");
  });
});

describe(`POST /${endpoint}`, () => {
  it(`POST /${endpoint} with invalid count in payload returns status 400 and error message`, async () => {
    const response = await fetch(`http://localhost:3002/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: "115322f6-c8bc-4136-9465-b19e3bb1594e",
        count: -10,
      }),
    });
    assert.deepStrictEqual(response.status, 400);
    const j = await response.json();
    assert.deepStrictEqual(j.message, "body/count must be >= 1");
  });
});

describe(`POST /${endpoint}`, () => {
  it(`POST /${endpoint} with valid payload returns status 200 and success message`, async () => {
    const response = await fetch(`http://localhost:3002/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: "115322f6-c8bc-4136-9465-b19e3bb1594e",
        count: 1,
      }),
    });
    assert.deepStrictEqual(response.status, 200);
    const j = await response.json();
    assert.ok(typeof j.message === "string");
    assert.ok(typeof j.remaining === "number");
  });
});
