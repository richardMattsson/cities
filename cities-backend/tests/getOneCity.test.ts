import { describe, it } from "node:test";
import { createGetOneCityHandler } from "../src/controllers/citiesController";
import assert from "node:assert";

describe("Testing get request of one city", () => {
  it("returns error 400 when a city does not exist", async () => {
    let statusCode = 0;
    let responseBody: unknown;

    const req = {
      params: {
        id: "2000",
      },
    } as any;

    const res = {
      status(code: number) {
        statusCode = code;
        return this;
      },
      json(body: unknown) {
        responseBody = body;
      },
    } as any;
    async function fakeGetOneCity() {
      return [];
    }
    const testHandler = createGetOneCityHandler(fakeGetOneCity);
    await testHandler(req, res, () => {});
    assert.equal(statusCode, 404);
  });
});
