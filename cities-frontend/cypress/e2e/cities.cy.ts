describe("cities", () => {
  let createdCityId: number | undefined;

  const cityName = (suffix: string) => `${suffix}${Cypress._.random(10)}`;

  beforeEach(() => cy.loginByFirebase());

  afterEach(() => {
    if (!createdCityId) return;
    cy.getFirebaseIdToken().then((token) => {
      cy.request({
        method: "DELETE",
        url: `/api/cities/${createdCityId}`,
        headers: { Authorization: `Bearer ${token}` },
        failOnStatusCode: false,
      })
        .its("status")
        .should("be.oneOf", [200, 404]);
    });
  });

  function createCityThroughUi(name: string, population: string) {
    cy.intercept("POST", "/api/cities").as("createCity");
    cy.intercept("GET", "/api/municipalities").as("getMunicipalities");
    cy.visit("/#/form/city/add");
    cy.wait("@getMunicipalities");
    cy.get('[data-cy="input-stad"]').type(name);
    cy.get('[data-cy="input-befolkning"]').type(population);
    cy.get('[data-cy="select-kommun"] option:not([disabled])')
      .first()
      .invoke("val")
      .then((municipalityId) => {
        cy.get('[data-cy="select-kommun"]').select(String(municipalityId));
      });
    cy.get('[data-cy="submit-form"]').click();
    return cy.wait("@createCity").then(({ request, response }) => {
      expect(response?.statusCode).to.eq(201);
      expect(request.headers.authorization).to.match(/^Bearer .+/);
      expect(response?.body[0]).to.include({
        cities_name: name,
        cities_population: Number(population),
      });
      createdCityId = response?.body[0].cities_id;
      expect(createdCityId, "created city id").to.be.a("number");
      return createdCityId!;
    });
  }

  it("should allow an authenticated user to create a city", () => {
    const name = cityName("create");
    createCityThroughUi(name, "12345");
    cy.intercept("GET", "/api/cities").as("getCities");
    cy.visit("/#/cities");
    cy.wait("@getCities").its("response.statusCode").should("eq", 200);
    cy.get('[data-cy="list-item"]').contains(name).should("be.visible");
  });

  it("should allow an authenticated user to update a city", () => {
    const originalName = cityName("update-original");
    const updatedName = cityName("update-complete");
    createCityThroughUi(originalName, "12345").then((cityId) => {
      cy.intercept("GET", `/api/cities/${cityId}`).as("getCity");
      cy.intercept("PUT", `/api/cities/${cityId}`).as("updateCity");
      cy.visit(`/#/form/city/update/${cityId}`);
      cy.wait("@getCity");
      cy.get('[data-cy="input-stad"]').clear().type(updatedName);
      cy.get('[data-cy="input-befolkning"]').clear().type("54321");
      cy.get('[data-cy="submit-form"]').click();
      cy.wait("@updateCity").then(({ request, response }) => {
        expect(response?.statusCode).to.eq(200);
        expect(request.headers.authorization).to.match(/^Bearer .+/);
        expect(response?.body[0]).to.include({
          cities_id: cityId,
          cities_name: updatedName,
          cities_population: 54321,
        });
      });
      cy.contains("Du har uppdaterat en stad").should("be.visible");
      cy.intercept("GET", `/api/cities/${cityId}`).as("getUpdatedCity");
      cy.visit(`/#/detail/city/${cityId}`);
      cy.wait("@getUpdatedCity").its("response.body.0").should("include", {
        cities_id: cityId,
        cities_name: updatedName,
        cities_population: 54321,
      });
      cy.contains(updatedName).should("be.visible");
    });
  });

  it("should allow an authenticated user to delete a city", () => {
    const name = cityName("delete");
    createCityThroughUi(name, "12345").then((cityId) => {
      cy.intercept("GET", `/api/cities/${cityId}`).as("getCity");
      cy.intercept("DELETE", `/api/cities/${cityId}`).as("deleteCity");
      cy.visit(`/#/detail/city/${cityId}`);
      cy.wait("@getCity");
      cy.on("window:confirm", () => true);
      cy.get('[data-cy="delete-item"]').click();
      cy.wait("@deleteCity").then(({ request, response }) => {
        expect(response?.statusCode).to.eq(200);
        expect(request.headers.authorization).to.match(/^Bearer .+/);
        expect(response?.body[0].cities_id).to.eq(cityId);
      });
      createdCityId = undefined;
      cy.contains("Du har tagit bort en stad").should("be.visible");
      cy.request({
        url: `/api/cities/${cityId}`,
        failOnStatusCode: false,
      })
        .its("status")
        .should("eq", 404);
      cy.visit("/#/cities");
      cy.contains('[data-cy="list-item"]', name).should("not.exist");
    });
  });

  it("Empty state", function () {
    cy.intercept("GET", "/api/cities/2000").as("getOneCity");
    cy.visit("/#/detail/city/2000");
    cy.wait("@getOneCity").then(({ response }) => {
      expect(response?.statusCode).to.eq(404);
    });

    cy.get('[data-cy="city-detail-error"]').should(
      "have.text",
      "Kunde inte hitta staden",
    );
  });
});
