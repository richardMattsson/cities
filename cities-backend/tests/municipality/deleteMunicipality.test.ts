import { describe, it } from "node:test";
import { createDeleteMunicipalityHandler } from "../../src/controllers/municipalityController";
import { createResponse } from "../helpers/createResponse";
import { DrizzleQueryError } from "drizzle-orm";
import { HttpError } from "../../src/errors/HttpError";
import { errorHandler } from "../../src/middleware/errorHandler";
import assert from "node:assert";

describe("Delete a municipality", () => {
  it("should show error 409 and message foreign key constraint", async () => {
    const cause = Object.assign(new Error("foreign key violation"), {
      code: "23001",
    });

    const databaseError = new DrizzleQueryError("fake query", [], cause);

    const fakeDeleteMunicipality = async () => {
      throw databaseError;
    };

    const handler = createDeleteMunicipalityHandler(fakeDeleteMunicipality);
    const { response, getBody, getStatus } = createResponse();

    let nextError: unknown;
    const next = (error: unknown) => {
      nextError = error;
    };

    await handler({ params: { id: "3" } } as any, response, next);

    assert.ok(nextError instanceof HttpError);
    assert.equal(nextError.status, 409);
    assert.equal(
      nextError.message,
      "Du kan inte ta bort kommunen eftersom den har städer.",
    );

    errorHandler(nextError, {} as any, response, () => {});

    assert.equal(getStatus(), 409);
    assert.deepEqual(getBody(), {
      error: "Du kan inte ta bort kommunen eftersom den har städer.",
    });
  });
});
