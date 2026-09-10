import { describe, it } from "node:test";
import { createDeleteCityHandler } from "../src/controllers/citiesController";
import assert from "node:assert";
import { HttpError } from "../src/errors/HttpError";

describe("Delete a city that does'nt exist", () => {
  it("handle request on a city that returns an empty array", async () => {
    let nextError: unknown;
    const req = { params: -1 } as any;
    const res = {} as any;

    const next = (error: unknown) => {
      nextError = error;
    };

    async function fakeDeleteCity() {
      return [];
    }
    const result = createDeleteCityHandler(fakeDeleteCity);
    await result(req, res, next);
    assert.ok(nextError instanceof HttpError);
    assert.equal((nextError as HttpError).message, "Kunde inte hitta staden");
    assert.equal((nextError as HttpError).status, 404);
  });
});
