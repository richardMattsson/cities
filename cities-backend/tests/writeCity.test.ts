import { describe, it } from "node:test";
import * as controller from "../src/controllers/citiesController";
import { updateCityValidation } from "../src/routes/citiesRoutes";
import assert from "node:assert";
import { validationResult } from "express-validator";
import type { Response } from "express";

type ResponseType = Response<any, Record<string, any>>;

describe("Detect unvalid city input", () => {
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

  it("controller returns 400 for invalid city data", async () => {
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

    await controller.updateCity(req, res, () => {});

    assert.equal(statusCode, 400);
    assert.ok(responseBody);
  });
});
