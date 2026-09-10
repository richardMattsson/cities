import { describe, it } from "node:test";
import { createGetOneCityHandler } from "../src/controllers/citiesController";
import { HttpError } from "../src/errors/HttpError";
import assert from "node:assert";

describe("Testing get request of one city", () => {
  it("returns error 404 when a city does not exist", async () => {
    let nextError: unknown;
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

    const next = (error: unknown) => {
      nextError = error;
    };

    const testHandler = createGetOneCityHandler(fakeGetOneCity);
    await testHandler(req, res, next);

    assert.ok(nextError instanceof HttpError);
    assert.equal(statusCode, 0);
    assert.ok(responseBody === undefined);
    assert.equal((nextError as HttpError).status, 404);
    assert.equal((nextError as HttpError).message, "Kunde inte hitta staden");
  });
});
