import { describe, it } from "node:test";
import { cityQueryValidation } from "../src/validation/cityValidation";
import assert from "node:assert";
import { createResponse } from "./helpers/createResponse";
import { validate } from "../src/middleware/validateInputMiddleware";
import { createSearchCityHandler } from "../src/controllers/citiesController";

describe("Search query validation and controller/service behavior", () => {
  it("verify no-match search is trimmed and returns 200 []", async () => {
    let receivedSearch: string | undefined;

    const req = {
      query: { search: "no-match search " },
    } as any;

    const { response, getStatus, getBody } = createResponse();

    const testCitySearch = async (search?: string) => {
      receivedSearch = search;
      return [];
    };

    const middleware = validate(cityQueryValidation);
    await middleware(req, response, () => {});

    const handler = createSearchCityHandler(testCitySearch);
    await handler(req, response, () => {});

    assert.equal(receivedSearch, "no-match search");
    assert.equal(getStatus(), 200);
    assert.deepEqual(getBody(), []);
  });

  it("return 400 error on invalid search input", async () => {
    const req = {
      query: {
        search:
          "To long string Over 100 characters long To long string Over 100 characters long To long string Over 100 characters long",
      },
    } as any;

    const { response, getStatus, getBody } = createResponse();

    const middleware = validate(cityQueryValidation);
    await middleware(req, response, () => {});

    assert.equal(getStatus(), 400);
    assert.deepEqual(getBody(), { error: "Ogiltig input" });
  });
});
