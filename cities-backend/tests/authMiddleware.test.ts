import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { authenticateToken } from "../src/middleware/authMiddleware.ts";
import type { Response } from "express";

type ResponseType = Response<any, Record<string, any>>;

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
    } as ResponseType;

    await authenticateToken(req, res, () => {
      nextCalled = true;
    });

    assert.equal(nextCalled, false);
    assert.equal(statusCode, 401);
    assert.deepEqual(responseBody, {
      error: "Förfrågan nekades. Prova att logga ut och in igen.",
    });
  });

  it("non-Bearer Authorization value", async () => {
    let statusCode = 0;
    let responseBody: unknown = null;
    let nextCalled = false;

    const req = {
      headers: { authorization: "Bearer " },
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
    } as ResponseType;

    await authenticateToken(req, res, () => {
      nextCalled = true;
    });

    assert.equal(nextCalled, false);
    assert.equal(statusCode, 401);
    assert.deepEqual(responseBody, {
      error: "Förfrågan nekades. Prova att logga ut och in igen.",
    });
  });

  it("`Bearer` with no token", async () => {
    let statusCode = 0;
    let responseBody: unknown = null;
    let nextCalled = false;

    const req = {
      headers: { authorization: "Bearer eyJhbGciOiJSUzI1NiI" },
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
    } as ResponseType;

    await authenticateToken(req, res, () => {
      nextCalled = true;
    });

    assert.equal(nextCalled, false);
    assert.equal(statusCode, 401);
    assert.deepEqual(responseBody, {
      error: "Invalid or expired token",
    });
  });
});
