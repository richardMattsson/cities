import { describe, it } from "node:test";
import { createGetOneCityHandler } from "../src/controllers/citiesController";
import { HttpError } from "../src/errors/HttpError";
import assert from "node:assert";
import { validate } from "../src/middleware/validateInputMiddleware";
import { getOneCityValidation } from "../src/validation/cityValidation";

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

  it("Invalid id return status 400", async () => {
    let statusCode = 0;
    let responseBody: unknown;
    let nextCalled = false;
    let callCount = 0;

    const req = {
      params: {
        id: "-1",
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

    const next = () => {
      callCount++;
      nextCalled = true;
    };

    const middleware = validate(getOneCityValidation);

    await middleware(req, res, next);

    assert.equal(statusCode, 400);
    assert.equal(nextCalled, false);
    assert.equal(callCount, 0);
    assert.deepEqual(responseBody, {
      error: "Ogiltig input",
    });
  });
});
