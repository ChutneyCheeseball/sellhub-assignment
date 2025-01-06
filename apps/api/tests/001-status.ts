import { describe, it } from "node:test";
import assert from "assert";

const endpoint = "status";

describe(`GET /${endpoint}`, () => {
  it(`GET /${endpoint} returns status 200 and {"ok":true}`, async () => {
    const response = await fetch(`http://localhost:3002/${endpoint}`);
    assert.deepStrictEqual(response.status, 200);
    const j = await response.json();
    assert.deepStrictEqual(j, { ok: true });
  });
});
