import { describe, it } from "node:test";
import { createGetOneCityHandler } from "../src/controllers/citiesController";
import { HttpError } from "../src/errors/HttpError";
import assert from "node:assert";
import { validate } from "../src/middleware/validateInputMiddleware";
import { getOneCityValidation } from "../src/validation/cityValidation";
import { createResponse } from "./helpers/createResponse";

describe("Testing get request of one city", () => {
  it("returns error 404 when a city does not exist", async () => {
    let nextError: unknown;
    let serviceCallCount = 0;

    async function fakeGetOneCity(id: number) {
      serviceCallCount++;
      assert.equal(id, 2000);
      return [];
    }

    const handler = createGetOneCityHandler(fakeGetOneCity);
    const middleware = validate(getOneCityValidation);
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
    assert.equal(getStatus(), 200);
    assert.ok(nextError instanceof HttpError);
    assert.equal((nextError as HttpError).status, 404);
    assert.equal((nextError as HttpError).message, "Kunde inte hitta staden");
    assert.equal(wasStatusCalled(), false);
    assert.equal(wasJsonCalled(), false);
  });

  const invalidIds = ["not-a-number", "0", "-1"];

  for (const invalidId of invalidIds) {
    it(`rejects invalid id "${invalidId}"`, async () => {
      let serviceCallCount = 0;

      async function fakeGetOneCity() {
        serviceCallCount++;
        return [];
      }

      const handler = createGetOneCityHandler(fakeGetOneCity);
      const middleware = validate(getOneCityValidation);
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
});
