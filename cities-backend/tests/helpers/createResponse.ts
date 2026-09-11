import type { Response } from "express";

type ResponseType = Response<any, Record<string, any>>;

export function createResponse() {
  let statusCode = 200;
  let responseBody: unknown;
  let statusCalled = false;
  let jsonCalled = false;

  return {
    response: {
      status(code: number) {
        statusCalled = true;
        statusCode = code;
        return this;
      },
      json(body: unknown) {
        jsonCalled = true;
        responseBody = body;
        return this;
      },
    } as ResponseType,
    getStatus: () => statusCode,
    getBody: () => responseBody,
    wasStatusCalled: () => statusCalled,
    wasJsonCalled: () => jsonCalled,
  };
}
