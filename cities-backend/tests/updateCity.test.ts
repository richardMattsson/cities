import { describe, it } from "node:test";
import * as controller from "../src/controllers/citiesController";
import assert from "node:assert";
import { HttpError } from "../src/errors/HttpError";
import { updateCityValidation } from "../src/validation/cityValidation";
import { validate } from "../src/middleware/validateInputMiddleware";
import { createResponse } from "./helpers/createResponse";

describe("Detect invalid city request", () => {
  it("Handle not found city that returns empty array", async () => {
    let nextError: unknown;
    let serviceCallCount = 0;

    async function fakeUpdateCity() {
      serviceCallCount++;
      return [];
    }

    const handler = controller.createUpdateCityHandler(fakeUpdateCity);
    const middleware = validate(updateCityValidation);
    const { response, getStatus, wasStatusCalled, wasJsonCalled } =
      createResponse();

    const req = {
      params: { id: "200000" },
      body: { cities_name: "test", cities_population: 123, municipality_id: 1 },
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

      async function fakeUpdateCity() {
        serviceCallCount++;
        return [];
      }

      const handler = controller.createUpdateCityHandler(fakeUpdateCity);
      const middleware = validate(updateCityValidation);
      const { response, getStatus, getBody, wasStatusCalled, wasJsonCalled } =
        createResponse();

      const req = {
        params: { id: invalidId },
        body: { cities_name: "", cities_population: -5, municipality_id: 0 },
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
