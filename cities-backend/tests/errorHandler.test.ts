import { DrizzleQueryError } from "drizzle-orm";
import { describe, it } from "node:test";
import { createResponse } from "./helpers/createResponse";
import { errorHandler } from "../src/middleware/errorHandler";
import assert from "node:assert";
import { HttpError } from "../src/errors/HttpError";

describe("Central error handler", () => {
  it("returns 400 when a foreign key violation occurs", () => {
    const cause = Object.assign(new Error("foreign key violation"), {
      code: "23503",
    });

    const databaseError = new DrizzleQueryError("fake query", [], cause);

    const { response, getStatus, getBody, wasStatusCalled, wasJsonCalled } =
      createResponse();

    errorHandler(databaseError, {} as any, response, (() => {}) as any);

    assert.equal(getStatus(), 400);
    assert.deepEqual(getBody(), {
      error: "Ogiltig input",
    });
    assert.equal(wasStatusCalled(), true);
    assert.equal(wasJsonCalled(), true);
  });

  it("returns 404 when a city is not found", () => {
    const cityNotFound = new HttpError(404, "Kunde inte hitta staden");

    const { response, getStatus, getBody, wasStatusCalled, wasJsonCalled } =
      createResponse();

    errorHandler(cityNotFound, {} as any, response, (() => {}) as any);

    assert.equal(getStatus(), 404);
    assert.deepEqual(getBody(), {
      error: "Kunde inte hitta staden",
    });
    assert.equal(wasStatusCalled(), true);
    assert.equal(wasJsonCalled(), true);
  });

  it("Unexpected error return status 500 and user friendly message", () => {
    const unexpectedError = new Error("Some very sensitive error message");

    const { response, getStatus, getBody, wasStatusCalled, wasJsonCalled } =
      createResponse();

    errorHandler(unexpectedError, {} as any, response, (() => {}) as any);

    assert.equal(getStatus(), 500);
    assert.deepStrictEqual(getBody(), {
      error: "Ett oväntat fel uppstod",
    });
    assert.notDeepStrictEqual(getBody(), {
      error: "Some very sensitive error message",
    });
    assert.equal(wasStatusCalled(), true);
    assert.equal(wasJsonCalled(), true);
  });
});
