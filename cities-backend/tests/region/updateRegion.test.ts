import assert from "node:assert";
import { describe, it } from "node:test";
import { validate } from "../../src/middleware/validateInputMiddleware";
import { updateRegionValidation } from "../../src/validation/regionValidation";
import { createUpdateRegionHandler } from "../../src/controllers/regionController";
import { createResponse } from "../helpers/createResponse";
import { HttpError } from "../../src/errors/HttpError";

describe("PUT region test", () => {
  it("send 400 on invalid input", async () => {
    const { response, getStatus, getBody } = createResponse();

    const req = {
      params: { id: "1" },
      body: {
        regions_name: "",
        regions_population: 5,
      },
    } as any;

    let serviceCallCount = 0;
    const fakeUpdateRegion = async () => {
      serviceCallCount++;
      return [];
    };

    const middleware = validate(updateRegionValidation);
    const handler = createUpdateRegionHandler(fakeUpdateRegion);

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

  const invalidIds = ["not-a-number", "0", "-1"];

  for (const invalidId of invalidIds) {
    it(`test for invalid id ${invalidId}`, async () => {
      const { response, getStatus, getBody } = createResponse();

      const req = {
        params: { id: invalidId },
        body: {
          regions_name: "valid-region-name",
          regions_population: 5,
        },
      } as any;

      let serviceCallCount = 0;
      const fakeUpdateRegion = async () => {
        serviceCallCount++;
        return [];
      };

      const middleware = validate(updateRegionValidation);
      const handler = createUpdateRegionHandler(fakeUpdateRegion);

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
  }

  it("sends 404 on valid request but region was not found", async () => {
    const { response, wasJsonCalled, wasStatusCalled } = createResponse();

    const req = {
      params: { id: "20" },
      body: {
        regions_name: "valid-region-name",
        regions_population: 5,
      },
    } as any;

    const fakeUpdateRegion = async () => {
      return [];
    };

    const middleware = validate(updateRegionValidation);
    const handler = createUpdateRegionHandler(fakeUpdateRegion);

    let runValidateNext = false;
    await middleware(req, response, () => {
      runValidateNext = true;
    });

    let nextError: unknown;
    await handler(req, response, (handlerError) => {
      nextError = handlerError;
    });

    assert.equal(runValidateNext, true);
    assert.ok(nextError instanceof HttpError);
    assert.equal((nextError as HttpError).status, 404);
    assert.deepEqual(
      (nextError as HttpError).message,
      "Kunde inte hitta regionen",
    );
    assert.equal(wasJsonCalled(), false);
    assert.equal(wasStatusCalled(), false);
  });

  it("expect the controller to forward the original error", async () => {
    let nextError: unknown;

    const databaseError = new Error("some-error-message");

    const fakeUpdateRegion = async () => {
      throw databaseError;
    };

    const handler = createUpdateRegionHandler(fakeUpdateRegion);
    const { response } = createResponse();

    const req = {
      params: { id: "1" },
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
