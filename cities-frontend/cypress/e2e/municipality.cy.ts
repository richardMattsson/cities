describe("municipality", () => {
  let createdMunicipalityId: number | undefined;
  let createdCityId: number | undefined;

  const municipalityName = (suffix: string) =>
    `${suffix}${Cypress._.random(1000)}`;

  const cityName = (suffix: string) => `test${suffix}${Cypress._.random(1000)}`;

  beforeEach(() => cy.loginByFirebase());

  afterEach(() => {
    if (createdCityId) {
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
    }

    if (createdMunicipalityId) {
      cy.getFirebaseIdToken().then((token) => {
        cy.request({
          method: "DELETE",
          url: `/api/municipalities/${createdMunicipalityId}`,
          headers: { Authorization: `Bearer ${token}` },
          failOnStatusCode: false,
        })
          .its("status")
          .should("be.oneOf", [200, 404]);
      });
    }
  });

  function createMunicipalityThroughUi(name: string, population: string) {
    cy.intercept("POST", "/api/municipalities").as("createMunicipality");
    cy.intercept("GET", "/api/regions").as("getRegions");
    cy.visit("/#/form/municipality/add");
    cy.wait("@getRegions");
    cy.get('[data-cy="input-kommun"]').type(name);
    cy.get('[data-cy="input-befolkning"]').type(population);
    cy.get('[data-cy="select-region"] option:not([disabled])')
      .first()
      .invoke("val")
      .then((regionId) => {
        cy.get('[data-cy="select-region"]').select(String(regionId));
      });
    cy.get('[data-cy="submit-form"]').click();
    return cy.wait("@createMunicipality").then(({ request, response }) => {
      expect(response?.statusCode).to.eq(201);
      expect(request.headers.authorization).to.match(/^Bearer .+/);
      expect(response?.body[0]).to.include({
        municipalities_name: name,
        municipalities_population: Number(population),
      });
      createdMunicipalityId = response?.body[0].municipalities_id;
      expect(createdMunicipalityId, "created municipality id").to.be.a(
        "number",
      );
      return createdMunicipalityId!;
    });
  }

  function createCityThroughUi(
    name: string,
    population: string,
    municipalityId: number,
  ) {
    cy.intercept("POST", "/api/cities").as("createCity");
    cy.intercept("GET", "/api/municipalities").as("getMunicipalities");

    cy.visit("/#/form/city/add");
    cy.wait("@getMunicipalities");

    cy.get('[data-cy="select-kommun"] option')
      .filter(`[value="${municipalityId}"]`)
      .should("exist");

    cy.get('[data-cy="select-kommun"]')
      .select(String(municipalityId))
      .should("have.value", String(municipalityId));

    cy.get('[data-cy="input-stad"]').type(name);
    cy.get('[data-cy="input-befolkning"]').type(population);
    cy.get('[data-cy="submit-form"]').click();

    return cy.wait("@createCity").then(({ request, response }) => {
      expect(request.body.municipality_id).to.eq(municipalityId);
      expect(response?.statusCode).to.eq(201);

      createdCityId = response?.body[0].cities_id;
      expect(createdCityId, "created city id").to.be.a("number");

      return createdCityId!;
    });
  }

  it("should allow an authenticated user to create a municipality", () => {
    const name = municipalityName("create");
    createMunicipalityThroughUi(name, "12345");
    cy.intercept("GET", "/api/municipalities").as("getMunicipalities");
    cy.visit("/#/municipalities");
    cy.wait("@getMunicipalities").its("response.statusCode").should("eq", 200);
    cy.get('[data-cy="list-item"]').contains(name).should("be.visible");
  });

  it("should allow an authenticated user to update a municipality", () => {
    const originalName = municipalityName("update-original");
    const updatedName = municipalityName("update-complete");
    createMunicipalityThroughUi(originalName, "12345").then(
      (municipalityId) => {
        cy.intercept("GET", `/api/municipalities/${municipalityId}`).as(
          "getMunicipality",
        );
        cy.intercept("PUT", `/api/municipalities/${municipalityId}`).as(
          "updateMunicipality",
        );
        cy.visit(`/#/form/municipality/update/${municipalityId}`);
        cy.wait("@getMunicipality");
        cy.get('[data-cy="input-kommun"]').clear().type(updatedName);
        cy.get('[data-cy="input-befolkning"]').clear().type("54321");
        cy.get('[data-cy="submit-form"]').click();
        cy.wait("@updateMunicipality").then(({ request, response }) => {
          expect(response?.statusCode).to.eq(200);
          expect(request.headers.authorization).to.match(/^Bearer .+/);
          expect(response?.body[0]).to.include({
            municipalities_id: municipalityId,
            municipalities_name: updatedName,
            municipalities_population: 54321,
          });
        });
        cy.contains("Du har uppdaterat en kommun").should("be.visible");
        cy.intercept("GET", `/api/municipalities/${municipalityId}`).as(
          "getUpdatedMunicipality",
        );
        cy.visit(`/#/detail/municipality/${municipalityId}`);
        cy.wait("@getUpdatedMunicipality")
          .its("response.body.0")
          .should("include", {
            municipalities_id: municipalityId,
            municipalities_name: updatedName,
            municipalities_population: 54321,
          });
        cy.contains(updatedName).should("be.visible");
      },
    );
  });

  it("should allow an authenticated user to delete a municipality", () => {
    const name = municipalityName("delete");
    createMunicipalityThroughUi(name, "12345").then((municipalityId) => {
      cy.intercept("GET", `/api/municipalities/${municipalityId}`).as(
        "getMunicipality",
      );
      cy.intercept("DELETE", `/api/municipalities/${municipalityId}`).as(
        "deleteMunicipality",
      );
      cy.visit(`/#/detail/municipality/${municipalityId}`);
      cy.wait("@getMunicipality");
      cy.on("window:confirm", () => true);
      cy.get('[data-cy="delete-item"]').click();
      cy.wait("@deleteMunicipality").then(({ request, response }) => {
        expect(response?.statusCode).to.eq(200);
        expect(request.headers.authorization).to.match(/^Bearer .+/);
        expect(response?.body[0].municipalities_id).to.eq(municipalityId);
      });
      cy.contains("Du har tagit bort en kommun").should("be.visible");

      cy.request({
        method: "GET",
        url: `/api/municipalities/${municipalityId}`,
        failOnStatusCode: false,
      })
        .its("status")
        .should("eq", 404);

      cy.visit("/#/municipalities");
      cy.contains('[data-cy="list-item"]', name).should("not.exist");
    });
  });

  it("should not be able to delete a municipality that has cities attached to it", () => {
    const nameMunicipality = municipalityName("foreign-key-municipality");
    const nameCity = cityName("foreign-key-city");
    createMunicipalityThroughUi(nameMunicipality, "12345").then(
      (municipalityId) => {
        createCityThroughUi(nameCity, "12345", municipalityId).then(
          (cityId) => {
            cy.intercept("GET", `/api/municipalities/${municipalityId}`).as(
              "getMunicipality",
            );
            cy.intercept("DELETE", `/api/municipalities/${municipalityId}`).as(
              "deleteMunicipality",
            );

            cy.on("window:confirm", () => true);

            cy.visit(`/#/detail/municipality/${municipalityId}`);

            cy.wait("@getMunicipality");

            cy.get('[data-cy="delete-item"]').click();

            cy.wait("@deleteMunicipality").then(({ response }) => {
              expect(response?.statusCode).to.eq(409);
            });

            cy.get('[data-cy="municipality-detail-error"]').should(
              "have.text",
              "Du kan inte ta bort kommunen eftersom den har städer.",
            );

            cy.intercept("GET", `/api/cities/${cityId}`).as("getOneCity");

            cy.visit(`/#/detail/city/${cityId}`);
            cy.wait("@getOneCity").then(({ response }) => {
              expect(response?.statusCode).to.eq(200);
            });
          },
        );
      },
    );
  });

  it("should send 404 when requested id is missing", () => {
    const missingMunicipalityId = 1000000;
    cy.intercept("GET", `/api/municipalities/${missingMunicipalityId}`).as(
      "getMunicipality",
    );

    cy.visit(`/#/detail/municipality/${missingMunicipalityId}`);

    cy.wait("@getMunicipality").then(({ response }) => {
      expect(response?.statusCode).to.eq(404);
      expect(response?.body).to.contain({ error: "Kunde inte hitta kommunen" });
    });

    cy.get('[data-cy="municipality-detail-error"]').should(
      "have.text",
      "Kunde inte hitta kommunen",
    );

    cy.get('[data-cy="edit-item"]').should("not.exist");
    cy.get('[data-cy="delete-item"]').should("not.exist");
  });
});
