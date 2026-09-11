import { describe, it } from "node:test";
import * as controller from "../src/controllers/citiesController";
import assert from "node:assert";
import { validationResult } from "express-validator";
import type { Response } from "express";
import { HttpError } from "../src/errors/HttpError";
import { updateCityValidation } from "../src/validation/cityValidation";
import { validate } from "../src/middleware/validateInputMiddleware";

type ResponseType = Response<any, Record<string, any>>;

describe("Detect invalid city request", () => {
  it("Handle not found city that returns empty array", async () => {
    let statusCode = 0;
    let responseBody: unknown;

    const req = {
      params: { id: "200000" },
      body: { cities_name: "test", cities_population: 123, municipality_id: 1 },
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

    async function fakeUpdateCity() {
      return [];
    }
    let nextError: unknown;
    const next = (error: unknown) => {
      nextError = error;
    };

    const testHandler = controller.createUpdateCityHandler(fakeUpdateCity);

    await Promise.all(
      updateCityValidation.map((validator) => validator.run(req)),
    );

    const result = validationResult(req);

    assert.equal(result.isEmpty(), true);

    await testHandler(req, res, next);

    assert.equal(statusCode, 0);
    assert.ok(responseBody === undefined);
    assert.ok(nextError instanceof HttpError);
    assert.equal((nextError as HttpError).status, 404);
    assert.equal((nextError as HttpError).message, "Kunde inte hitta staden");
  });

  it("rejects an invalid request to update a city", async () => {
    const req = {
      params: { id: "0" },
      body: { cities_name: "", cities_population: -5, municipality_id: 0 },
    } as any;

    await Promise.all(
      updateCityValidation.map((validator) => validator.run(req)),
    );

    const result = validationResult(req);

    assert.equal(result.isEmpty(), false);
    assert.equal(result.array().length, 4);
  });

  it("request with invalid input returns status 400 and correct error message", async () => {
    let statusCode = 0;
    let responseBody: unknown;
    let nextCalled = false;
    let callCount = 0;

    const req = {
      params: { id: "0" },
      body: {
        cities_name: "",
        cities_population: -5,
        municipality_id: 0,
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
    } as ResponseType;

    const next = () => {
      callCount++;
      nextCalled = true;
    };

    const middleware = validate(updateCityValidation);

    await middleware(req, res, next);

    assert.equal(nextCalled, false);
    assert.equal(callCount, 0);
    assert.equal(statusCode, 400);
    assert.deepEqual(responseBody, {
      error: "Ogiltig input",
    });
  });
});
