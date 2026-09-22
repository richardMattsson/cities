import { describe, it } from "node:test";
import { createGetOneMunicipalityHandler } from "../../src/controllers/municipalityController";
import { getOneMunicipalityValidation } from "../../src/validation/municipalityValidation";
import { createResponse } from "../helpers/createResponse";
import { HttpError } from "../../src/errors/HttpError";
import assert from "node:assert";
import { validate } from "../../src/middleware/validateInputMiddleware";

describe("GET one municipality test", () => {
  const invalidIds = ["not-a-number", "0", "-1"];

  for (const invalidId of invalidIds) {
    it(`rejects invalid id "${invalidId}"`, async () => {
      let serviceCallCount = 0;

      async function fakeGetOneMunicipality() {
        serviceCallCount++;
        return [];
      }

      const handler = createGetOneMunicipalityHandler(fakeGetOneMunicipality);
      const middleware = validate(getOneMunicipalityValidation);
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

  it("sends 404 on valid request but municipality was not found", async () => {
    const { response, wasJsonCalled, wasStatusCalled } = createResponse();

    const req = {
      params: { id: "20" },
    } as any;

    let serviceCalled = false;
    const fakeGetOneMunicipality = async () => {
      serviceCalled = true;
      return [];
    };

    const middleware = validate(getOneMunicipalityValidation);
    const handler = createGetOneMunicipalityHandler(fakeGetOneMunicipality);

    let validateNext = false;
    await middleware(req, response, () => {
      validateNext = true;
    });

    let nextError: unknown;
    await handler(req, response, (handlerError) => {
      nextError = handlerError;
    });

    assert.equal(validateNext, true);
    assert.equal(serviceCalled, true);
    assert.ok(nextError instanceof HttpError);
    assert.equal((nextError as HttpError).status, 404);
    assert.deepEqual(
      (nextError as HttpError).message,
      "Kunde inte hitta kommunen",
    );
    assert.equal(wasJsonCalled(), false);
    assert.equal(wasStatusCalled(), false);
  });
});
