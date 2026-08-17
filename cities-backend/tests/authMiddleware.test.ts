import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { authenticateToken } from "../src/middleware/authMiddleware.ts";

describe("authenticateToken", () => {
  it("rejects a request that is missing a bearer token", async () => {
    let statusCode = 0;
    let responseBody: unknown = null;
    let nextCalled = false;

    const req = {
      headers: {},
    } as any;

    const res = {
      status: (code: number) => {
        statusCode = code;
        return {
          json: (body: unknown) => {
            responseBody = body;
          },
        };
      },
    } as any;

    await authenticateToken(req, res, () => {
      nextCalled = true;
    });

    assert.equal(nextCalled, false);
    assert.equal(statusCode, 401);
    assert.deepEqual(responseBody, {
      error: "Missing or invalid authorization header",
    });
  });
});
