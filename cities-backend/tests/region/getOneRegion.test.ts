import { describe, it } from "node:test";
import { createGetOneRegionHandler } from "../../src/controllers/regionController";
import assert from "node:assert";
import { validate } from "../../src/middleware/validateInputMiddleware";
import { getOneRegionValidation } from "../../src/validation/regionValidation";
import { createResponse } from "../helpers/createResponse";
import { HttpError } from "../../src/errors/HttpError";

describe("GET one region test", () => {
  const invalidIds = ["not-a-number", "0", "-1"];

  for (const invalidId of invalidIds) {
    it(`rejects invalid id "${invalidId}"`, async () => {
      let serviceCallCount = 0;

      async function fakeGetOneRegion() {
        serviceCallCount++;
        return [];
      }

      const handler = createGetOneRegionHandler(fakeGetOneRegion);
      const middleware = validate(getOneRegionValidation);
      const { response, getStatus, getBody, wasStatusCalled, wasJsonCalled } =
        createResponse();

      const req = {
        params: {
          id: invalidId,
        },
      } as any;

      let downstreamHandlerCalled = false;

      await middleware(req, response, () => {
        downstreamHandlerCalled = true;
        return handler(req, response, () => {});
      });

      assert.equal(getStatus(), 400);
      assert.deepEqual(getBody(), { error: "Ogiltig input" });
      assert.equal(wasStatusCalled(), true);
      assert.equal(wasJsonCalled(), true);
      assert.equal(downstreamHandlerCalled, false);
      assert.equal(serviceCallCount, 0);
    });
  }

  it("returns 404 when a region does not exist", async () => {
    let nextError: unknown;
    let serviceCallCount = 0;

    async function fakeGetOneRegion(id: number) {
      serviceCallCount++;
      assert.equal(id, 2000);
      return [];
    }

    const handler = createGetOneRegionHandler(fakeGetOneRegion);
    const middleware = validate(getOneRegionValidation);
    const { response, getStatus, wasStatusCalled, wasJsonCalled } =
      createResponse();

    const req = {
      params: {
        id: "2000",
      },
    } as any;

    await new Promise<void>((resolve, reject) => {
      middleware(req, response, (error?: unknown) => {
        if (error) {
          reject(error);
          return;
        }

        handler(req, response, (handlerError: unknown) => {
          nextError = handlerError;
          resolve();
        }).catch(reject);
      }).catch(reject);
    });

    assert.equal(serviceCallCount, 1);
    assert.ok(nextError instanceof HttpError);
    assert.equal((nextError as HttpError).status, 404);
    assert.equal((nextError as HttpError).message, "Kunde inte hitta regionen");
    assert.equal(wasStatusCalled(), false);
    assert.equal(wasJsonCalled(), false);
  });
});
