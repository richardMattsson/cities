import { describe, it } from "node:test";
import { createDeleteRegionHandler } from "../../src/controllers/regionController";
import { createResponse } from "../helpers/createResponse";
import { DrizzleQueryError } from "drizzle-orm";
import { HttpError } from "../../src/errors/HttpError";
import { errorHandler } from "../../src/middleware/errorHandler";
import assert from "node:assert";
import { validate } from "../../src/middleware/validateInputMiddleware";
import { deleteRegionValidation } from "../../src/validation/regionValidation";

describe("DELETE region test", () => {
  it("should show error 409 and message foreign key constraint", async () => {
    const cause = Object.assign(new Error("foreign key violation"), {
      code: "23001",
    });

    const databaseError = new DrizzleQueryError("fake query", [], cause);

    const fakeDeleteRegion = async () => {
      throw databaseError;
    };

    const handler = createDeleteRegionHandler(fakeDeleteRegion);
    const { response, getBody, getStatus, wasJsonCalled, wasStatusCalled } =
      createResponse();

    let nextError: unknown;
    const next = (error: unknown) => {
      nextError = error;
    };

    await handler({ params: { id: "3" } } as any, response, next);

    assert.ok(nextError instanceof HttpError);
    assert.equal(nextError.status, 409);
    assert.equal(
      nextError.message,
      "Du kan inte ta bort regionen eftersom den har kommuner.",
    );
    assert.equal(wasJsonCalled(), false);
    assert.equal(wasStatusCalled(), false);

    errorHandler(nextError, {} as any, response, () => {});

    assert.equal(getStatus(), 409);
    assert.deepEqual(getBody(), {
      error: "Du kan inte ta bort regionen eftersom den har kommuner.",
    });
  });

  it("expect the controller to forward the original error", async () => {
    let nextError: unknown;

    const databaseError = new Error("some-error-message");

    const fakeDeleteRegion = async () => {
      throw databaseError;
    };

    const handler = createDeleteRegionHandler(fakeDeleteRegion);
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

  it("returns 404 when a region does not exist", async () => {
    let nextError: unknown;
    let serviceCallCount = 0;

    async function fakeDeleteRegion(id: number) {
      serviceCallCount++;
      assert.equal(id, 2000);
      return [];
    }

    const handler = createDeleteRegionHandler(fakeDeleteRegion);
    const middleware = validate(deleteRegionValidation);
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

  const invalidIds = ["not-a-number", "0", "-1"];

  for (const invalidId of invalidIds) {
    it(`rejects invalid id "${invalidId}"`, async () => {
      let serviceCallCount = 0;

      async function fakeDeleteRegion() {
        serviceCallCount++;
        return [];
      }

      const handler = createDeleteRegionHandler(fakeDeleteRegion);
      const middleware = validate(deleteRegionValidation);
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
