import assert from "node:assert";
import { describe, it } from "node:test";
import { createResponse } from "../helpers/createResponse";
import { validate } from "../../src/middleware/validateInputMiddleware";
import { updateMunicipalityValidation } from "../../src/validation/municipalityValidation";
import { createUpdateMunicipalityHandler } from "../../src/controllers/municipalityController";
import { HttpError } from "../../src/errors/HttpError";
import { DrizzleQueryError } from "drizzle-orm";

describe("Update municipality test", () => {
  it("validation send 400 error on invalid input", async () => {
    const { response, getStatus, getBody } = createResponse();

    const req = {
      params: { id: "1" },
      body: {
        municipalities_name: "",
        municipalities_population: 5,
        region_id: 1,
      },
    } as any;

    let serviceCallCount = 0;
    const fakeUpdateMunicipality = async (
      _name: string,
      _population: number,
      _region_id: number,
    ) => {
      serviceCallCount++;
      return [];
    };

    const middleware = validate(updateMunicipalityValidation);
    const handler = createUpdateMunicipalityHandler(fakeUpdateMunicipality);

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

  it("test for invalid number id < 1", async () => {
    const { response, getStatus, getBody } = createResponse();

    const req = {
      params: { id: "0" },
      body: {
        municipalities_name: "cityname",
        municipalities_population: 5,
        region_id: 1,
      },
    } as any;

    let serviceCallCount = 0;
    const fakeUpdateMunicipality = async (
      _name: string,
      _population: number,
      _region_id: number,
    ) => {
      serviceCallCount++;
      return [];
    };

    const middleware = validate(updateMunicipalityValidation);
    const handler = createUpdateMunicipalityHandler(fakeUpdateMunicipality);

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

  it("sends 404 on valid request but municipality was not found", async () => {
    const { response, wasJsonCalled, wasStatusCalled } = createResponse();

    const req = {
      params: { id: "20" },
      body: {
        municipalities_name: "cityname",
        municipalities_population: 5,
        region_id: 1,
      },
    } as any;

    const fakeUpdateMunicipality = async (
      _name: string,
      _population: number,
      _region_id: number,
    ) => {
      return [];
    };

    const middleware = validate(updateMunicipalityValidation);
    const handler = createUpdateMunicipalityHandler(fakeUpdateMunicipality);

    await middleware(req, response, () => {});

    let nextError: unknown;
    await handler(req, response, (handlerError) => {
      nextError = handlerError;
    });

    assert.equal((nextError as HttpError).status, 404);
    assert.deepEqual(
      (nextError as HttpError).message,
      "Kunde inte hitta kommunen",
    );
    assert.equal(wasJsonCalled(), false);
    assert.equal(wasStatusCalled(), false);
  });

  it("Send 409 on PUT municipality with duplicate name", async () => {
    const cause = Object.assign(new Error("not-unique-name"), { code: 23505 });

    const databaseError = new DrizzleQueryError("not-unique-name", [], cause);

    const fakeUpdateMunicipality = async () => {
      throw databaseError;
    };

    const handler = createUpdateMunicipalityHandler(fakeUpdateMunicipality);

    const req = {
      params: { id: "1" },
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
