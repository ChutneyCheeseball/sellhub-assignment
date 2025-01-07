import { describe, it } from "node:test";
import assert from "assert";

const endpoint = "products";

describe(`GET /${endpoint}`, () => {
  it(`GET /${endpoint} returns status 200 and an array listing`, async () => {
    const response = await fetch(`http://localhost:3002/${endpoint}`);
    assert.deepStrictEqual(response.status, 200);
    const list = await response.json();
    assert.ok(Array.isArray(list));
  });
});

describe(`GET /${endpoint}/<malformed_uuid>`, () => {
  it(`GET /${endpoint}/<malformed_uuid> returns status 400 and error message`, async () => {
    const response = await fetch(`http://localhost:3002/${endpoint}/abcde`);
    assert.deepStrictEqual(response.status, 400);
    const j = await response.json();
    assert.deepStrictEqual(j.message, 'params/id must match format "uuid"');
  });
});

describe(`GET /${endpoint}/<invalid_uuid>`, () => {
  it(`GET /${endpoint}/<invalid_uuid> returns status 404 and error message`, async () => {
    const response = await fetch(
      `http://localhost:3002/${endpoint}/00000000-0000-0000-0000-000000000000`
    );
    assert.deepStrictEqual(response.status, 404);
    const j = await response.json();
    assert.deepStrictEqual(j.message, "Product not found");
  });
});

const uuid = "115322f6-c8bc-4136-9465-b19e3bb1594e";
describe(`GET /${endpoint}/${uuid}`, () => {
  it(`GET /${endpoint}/${uuid} returns status 200 and valid product`, async () => {
    const response = await fetch(`http://localhost:3002/${endpoint}/${uuid}`);
    assert.deepStrictEqual(response.status, 200);
    const j = await response.json();
    assert.deepStrictEqual(j.id, uuid);
    assert.ok(typeof j.name === "string");
    assert.ok(typeof j.inventory_count === "number");
  });
});
