import { describe, it } from "node:test";
import * as controller from "../src/controllers/citiesController";
import { updateCityValidation } from "../src/routes/citiesRoutes";
import assert from "node:assert";
import { validationResult } from "express-validator";
import type { Response } from "express";
import { HttpError } from "../src/errors/HttpError";

type ResponseType = Response<any, Record<string, any>>;

describe("Detect invalid city request", () => {
  it("Handle not found city that returns empty array", async () => {
    let nextError: unknown;

    const req = {
      params: { id: "-1" },
    } as any;

    const res = {} as any;

    async function fakeUpdateCity() {
      return [];
    }

    const next = (error: unknown) => {
      nextError = error;
    };

    const testHandler = controller.createGetOneCityHandler(fakeUpdateCity);
    await testHandler(req, res, next);

    assert.ok(nextError instanceof HttpError);
    assert.equal((nextError as HttpError).status, 404);
    assert.equal((nextError as HttpError).message, "Kunde inte hitta staden");
  });

  it("rejects an invalid request to update a city", async () => {
    const req = {
      params: { id: 0 },
      body: { cities_name: "", cities_population: -5, municipality_id: 0 },
    } as any;

    await Promise.all(
      updateCityValidation.map((validator) => validator.run(req)),
    );

    const result = validationResult(req);

    assert.equal(result.isEmpty(), false);
    assert.equal(result.array().length, 4);
  });

  it("controller returns 400 for invalid city data and correct error message", async () => {
    const req = {
      params: { id: "0" },
      body: {
        cities_name: "",
        cities_population: -5,
        municipality_id: 0,
      },
    } as any;

    let statusCode = 0;
    let responseBody: unknown;
    let nextCalled = false;

    const next = () => {
      nextCalled = true;
    };

    const res = {
      status(code: number) {
        statusCode = code;
        return this;
      },
      json(body: unknown) {
        responseBody = body;
      },
    } as ResponseType;

    await Promise.all(
      updateCityValidation.map((validator) => validator.run(req)),
    );

    let callCount = 0;

    async function fakeUpdateCity() {
      callCount++;
      const response = [
        {
          cities_id: 0,
          cities_name: "",
          cities_population: 0,
          municipality_id: 1,
        },
      ];

      return response;
    }

    const testHandler = controller.createUpdateCityHandler(fakeUpdateCity);
    await testHandler(req, res, next);

    assert.equal(nextCalled, false);
    assert.equal(callCount, 0);
    assert.equal(statusCode, 400);
    assert.deepEqual(responseBody, {
      error: "Ogiltig input",
    });
  });
});
