import { describe, it } from "node:test";
import { addCityValidation } from "../src/routes/citiesRoutes";
import { validationResult } from "express-validator";
import assert from "node:assert";
import { createPostCityHandler } from "../src/controllers/citiesController";

describe("Test for invalid city input", () => {
  it("Rejects an invalid request to add a new city", async () => {
    const req = {
      body: {
        cities_name: "",
        cities_population: -5,
        municipality_id: 0,
      },
    };

    await Promise.all(addCityValidation.map((validator) => validator.run(req)));

    const result = validationResult(req);

    assert.equal(result.isEmpty(), false);
  });

  it("Rejects a city name containing only white space.", async () => {
    const req = {
      body: {
        cities_name: "     ",
        cities_population: 15,
        municipality_id: 1,
      },
    };

    await Promise.all(addCityValidation.map((validator) => validator.run(req)));

    const result = validationResult(req);

    assert.equal(result.isEmpty(), false);
  });

  it("test if the bad request hits the service layer", async () => {
    const req = {
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
    } as any;

    await Promise.all(addCityValidation.map((validator) => validator.run(req)));

    let callCount = 0;
    async function fakePostCity() {
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
    const testHandler = createPostCityHandler(fakePostCity);
    await testHandler(req, res, next);

    assert.equal(nextCalled, false);
    assert.equal(callCount, 0);
    assert.equal(statusCode, 400);
    assert.deepEqual(responseBody, {
      error: "Ogiltig input",
    });
  });
});
