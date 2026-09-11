import { describe, it } from "node:test";
import { validationResult } from "express-validator";
import assert from "node:assert";
import { validate } from "../src/middleware/validateInputMiddleware";
import { addCityValidation } from "../src/validation/cityValidation";

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
});
