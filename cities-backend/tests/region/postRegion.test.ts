import assert from "node:assert";
import { describe, it } from "node:test";
import { validate } from "../../src/middleware/validateInputMiddleware";
import { postRegionValidation } from "../../src/validation/regionValidation";
import { createResponse } from "../helpers/createResponse";
import { createPostRegionHandler } from "../../src/controllers/regionController";
import { validationResult } from "express-validator";
import { HttpError } from "../../src/errors/HttpError";
import { DrizzleQueryError } from "drizzle-orm";

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

  it("Send 409 on POST region with duplicate name", async () => {
    const cause = Object.assign(new Error("not-unique-name"), { code: 23505 });

    const databaseError = new DrizzleQueryError("not-unique-name", [], cause);

    const fakePostRegion = async () => {
      throw databaseError;
    };

    const handler = createPostRegionHandler(fakePostRegion);

    const req = {
      body: { regions_name: "Blekinge", regions_population: 123 },
    } as any;
    const { response, wasStatusCalled, wasJsonCalled } = createResponse();

    let nextError: unknown;
    await handler(req, response, (error) => {
      nextError = error;
    });

    assert.ok(nextError instanceof HttpError);
    assert.equal(nextError.status, 409);
    assert.equal(
      nextError.message,
      "Det finns redan en region med det namnet.",
    );
    assert.equal(wasStatusCalled(), false);
    assert.equal(wasJsonCalled(), false);
  });
});
