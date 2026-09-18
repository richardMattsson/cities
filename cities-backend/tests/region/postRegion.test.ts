import assert from "node:assert";
import { describe, it } from "node:test";
import { validate } from "../../src/middleware/validateInputMiddleware";
import { postRegionValidation } from "../../src/validation/regionValidation";
import { createResponse } from "../helpers/createResponse";
import { createPostRegionHandler } from "../../src/controllers/regionController";
import { validationResult } from "express-validator";

describe("POST region test", () => {
  it("send 400 on invalid input", async () => {
    const req = {
      body: { regions_name: "", regions_population: 0 },
    } as any;

    const { response, getStatus, getBody } = createResponse();

    let serviceCallCount = 0;
    const fakePostRegion = async () => {
      serviceCallCount++;
      return [];
    };

    const middleware = validate(postRegionValidation);
    const handler = createPostRegionHandler(fakePostRegion);

    let downstreamHandlerCalled = false;
    await middleware(req, response, () => {
      downstreamHandlerCalled = true;
      return handler(req, response, () => {});
    });

    assert.equal(getStatus(), 400);
    assert.deepEqual(getBody(), { error: "Ogiltig input" });
    assert.equal(downstreamHandlerCalled, false);
    assert.equal(serviceCallCount, 0);
  });

  it("Rejects a region name containing only white space.", async () => {
    const req = {
      body: {
        regions_name: "    ",
        regions_population: 15,
      },
    };

    await Promise.all(
      postRegionValidation.map((validator) => validator.run(req)),
    );

    const result = validationResult(req);

    assert.equal(result.isEmpty(), false);
  });

  it("Rejects a population with a negative number", async () => {
    const req = {
      body: {
        regions_name: "valid-name",
        regions_population: -15,
      },
    };

    await Promise.all(
      postRegionValidation.map((validator) => validator.run(req)),
    );

    const result = validationResult(req);

    assert.equal(result.isEmpty(), false);
  });

  it("expect the controller to forward the original error", async () => {
    let nextError: unknown;

    const databaseError = new Error("some-error-message");

    const fakePostRegion = async () => {
      throw databaseError;
    };

    const handler = createPostRegionHandler(fakePostRegion);
    const { response } = createResponse();

    const req = {
      body: {
        regions_name: "test",
        regions_population: 5,
      },
    } as any;

    await handler(req, response, (error: unknown) => {
      nextError = error;
    });

    assert.strictEqual(nextError, databaseError);
  });
});
