import { describe, it } from "node:test";
import { createDeleteCityHandler } from "../src/controllers/citiesController";
import assert from "node:assert";
import { HttpError } from "../src/errors/HttpError";

describe("Delete a city that does'nt exist", () => {
  it("handle request on a city that returns an empty array", async () => {
    let nextError: unknown;
    let statusCode = 0;
    let responseBody: unknown;

    const req = { params: { id: "20000" } } as any;
    const res = {
      status(code: number) {
        statusCode = code;
        return this;
      },
      json(body: unknown) {
        responseBody = body;
      },
    } as any;

    const next = (error: unknown) => {
      nextError = error;
    };

    async function fakeDeleteCity() {
      return [];
    }
    const result = createDeleteCityHandler(fakeDeleteCity);
    await result(req, res, next);

    assert.equal(statusCode, 0);
    assert.ok(responseBody === undefined);
    assert.ok(nextError instanceof HttpError);
    assert.equal((nextError as HttpError).message, "Kunde inte hitta staden");
    assert.equal((nextError as HttpError).status, 404);
  });
});
