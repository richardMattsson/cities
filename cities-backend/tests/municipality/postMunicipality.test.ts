import assert from "node:assert";
import { describe, it } from "node:test";
import { createResponse } from "../helpers/createResponse";
import { validate } from "../../src/middleware/validateInputMiddleware";
import { postMunicipalityValidation } from "../../src/validation/municipalityValidation";
import { createPostMunicipalityHandler } from "../../src/controllers/municipalityController";

describe("Post municipality test", () => {
  it("validation send 400 error on invalid input", async () => {
    const { response, getStatus, getBody } = createResponse();

    const req = {
      body: {
        municipalities_name: "",
        municipalities_population: -5,
        region_id: 0,
      },
    } as any;

    let serviceCallCount = 0;
    const fakePostMunicipality = async (
      _name: string,
      _population: number,
      _region_id: number,
    ) => {
      serviceCallCount++;
      return [];
    };

    const middleware = validate(postMunicipalityValidation);
    const handler = createPostMunicipalityHandler(fakePostMunicipality);

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
});
