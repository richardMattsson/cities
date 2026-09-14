import { describe, it } from "node:test";
import { validationResult } from "express-validator";
import assert from "node:assert";
import { validate } from "../src/middleware/validateInputMiddleware";
import { addCityValidation } from "../src/validation/cityValidation";
import { createResponse } from "./helpers/createResponse";
import { createPostCityHandler } from "../src/controllers/citiesController";
import { DrizzleQueryError } from "drizzle-orm";

describe("Test for invalid city input", () => {
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
    let statusCode = 0;
    let responseBody: unknown;
    let nextCalled = false;
    let callCount = 0;

    const req = {
      body: {
        cities_name: "",
        cities_population: 5,
        municipality_id: 10,
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

    const middleware = validate(addCityValidation);

    await middleware(req, res, next);

    assert.equal(statusCode, 400);
    assert.equal(nextCalled, false);
    assert.equal(callCount, 0);
    assert.deepEqual(responseBody, {
      error: "Ogiltig input",
    });
  });

  it("expect the controller to forward the original error", async () => {
    let nextError: unknown;

    const cause = Object.assign(new Error("foreign key violation"), {
      code: "23503",
    });

    const databaseError = new DrizzleQueryError(
      "insert into cities",
      [],
      cause,
    );

    const fakePostCity = async () => {
      throw databaseError;
    };
    const handler = createPostCityHandler(fakePostCity);
    const { response } = createResponse();

    const req = {
      body: {
        cities_name: "test",
        cities_population: 5,
        municipality_id: 1000,
      },
    } as any;

    await handler(req, response, (error: unknown) => {
      nextError = error;
    });

    assert.strictEqual(nextError, databaseError);
  });
});
