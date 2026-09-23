import assert from "node:assert";
import { describe, it } from "node:test";
import { createResponse } from "../helpers/createResponse";
import { validate } from "../../src/middleware/validateInputMiddleware";
import { postMunicipalityValidation } from "../../src/validation/municipalityValidation";
import { createPostMunicipalityHandler } from "../../src/controllers/municipalityController";
import { DrizzleQueryError } from "drizzle-orm";
import { HttpError } from "../../src/errors/HttpError";

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

  it("Send 409 on POST municipality with duplicate name", async () => {
    const cause = Object.assign(new Error("not-unique-name"), { code: 23505 });

    const databaseError = new DrizzleQueryError("not-unique-name", [], cause);

    const fakePostMunicipality = async () => {
      throw databaseError;
    };

    const handler = createPostMunicipalityHandler(fakePostMunicipality);

    const req = {
      body: { municipalities_name: "Blekinge", municipalities_population: 123 },
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
      "Det finns redan en kommun med det namnet.",
    );
    assert.equal(wasStatusCalled(), false);
    assert.equal(wasJsonCalled(), false);
  });
});
