import { describe, it } from "node:test";
import { createGetMunicipalitiesFromRegionHandler } from "../../src/controllers/regionController";
import assert from "node:assert";
import { validate } from "../../src/middleware/validateInputMiddleware";
import { getMunicipalitiesFromRegionValidation } from "../../src/validation/regionValidation";
import { createResponse } from "../helpers/createResponse";

describe("GET municipalities from region test", () => {
  const invalidIds = ["not-a-number", "0", "-1"];

  for (const invalidId of invalidIds) {
    it(`rejects invalid id "${invalidId}"`, async () => {
      let serviceCallCount = 0;

      async function fakeGetMunicipalitiesFromRegion() {
        serviceCallCount++;
        return [];
      }

      const handler = createGetMunicipalitiesFromRegionHandler(
        fakeGetMunicipalitiesFromRegion,
      );
      const middleware = validate(getMunicipalitiesFromRegionValidation);

      const req = {
        params: {
          id: invalidId,
        },
      } as any;
      const { response, getStatus, getBody, wasStatusCalled, wasJsonCalled } =
        createResponse();

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

  it("returns 200 when no municipalities are attached to a region", async () => {
    let serviceCallCount = 0;

    async function fakeGetMunicipalitiesFromRegion(id: number) {
      serviceCallCount++;
      assert.equal(id, 2000);
      return [];
    }

    const handler = createGetMunicipalitiesFromRegionHandler(
      fakeGetMunicipalitiesFromRegion,
    );
    const middleware = validate(getMunicipalitiesFromRegionValidation);
    const { response, getBody, getStatus, wasStatusCalled, wasJsonCalled } =
      createResponse();

    const req = {
      params: {
        id: "2000",
      },
    } as any;

    let validateNext = false;
    await middleware(req, response, () => {
      validateNext = true;
    });

    await handler(req, response, () => {});

    assert.equal(validateNext, true);
    assert.equal(serviceCallCount, 1);
    assert.equal(wasStatusCalled(), false);
    assert.equal(wasJsonCalled(), true);
    assert.deepEqual(getBody(), []);
  });
});
