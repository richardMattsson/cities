describe("region", () => {
  let createdRegionId: number | undefined;
  let createdMunicipalityId: number | undefined;

  const regionName = (suffix: string) => `${suffix}${Cypress._.random(1000)}`;

  const municipalityName = (suffix: string) =>
    `${suffix}${Cypress._.random(1000)}`;

  beforeEach(() => cy.loginByFirebase());

  afterEach(() => {
    if (createdMunicipalityId) {
      cy.getFirebaseIdToken().then((token) => {
        cy.request({
          method: "DELETE",
          url: `/api/municipalities/${createdMunicipalityId}`,
          headers: { Authorization: `Bearer ${token}` },
          failOnStatusCode: false,
        })
          .its("status")
          .should("be.oneOf", [200, 404])
          .then(() => (createdMunicipalityId = undefined));
      });
    }
    if (createdRegionId) {
      cy.getFirebaseIdToken().then((token) => {
        cy.request({
          method: "DELETE",
          url: `/api/regions/${createdRegionId}`,
          headers: { Authorization: `Bearer ${token}` },
          failOnStatusCode: false,
        })
          .its("status")
          .should("be.oneOf", [200, 404])
          .then(() => (createdRegionId = undefined));
      });
    }
  });

  function createRegionThroughUi(name: string, population: string) {
    cy.intercept("POST", "/api/regions").as("createRegion");
    cy.visit("/#/form/region/add");
    cy.get('[data-cy="input-region"]').type(name);
    cy.get('[data-cy="input-befolkning"]').type(population);
    cy.get('[data-cy="submit-form"]').click();
    return cy.wait("@createRegion").then(({ request, response }) => {
      expect(response?.statusCode).to.eq(201);
      expect(request.headers.authorization).to.match(/^Bearer .+/);
      expect(response?.body[0]).to.include({
        regions_name: name,
        regions_population: Number(population),
      });
      createdRegionId = response?.body[0].regions_id;
      expect(createdRegionId, "created region id").to.be.a("number");
      return createdRegionId!;
    });
  }

  function createMunicipalityThroughUi(
    name: string,
    population: string,
    regionId: number,
  ) {
    cy.intercept("POST", "/api/municipalities").as("createMunicipality");
    cy.intercept("GET", "/api/regions").as("getRegions");

    cy.visit("/#/form/municipality/add");
    cy.wait("@getRegions");

    cy.get('[data-cy="select-region"] option')
      .filter(`[value="${regionId}"]`)
      .should("exist");

    cy.get('[data-cy="select-region"]')
      .select(String(regionId))
      .should("have.value", String(regionId));

    cy.get('[data-cy="input-kommun"]').type(name);
    cy.get('[data-cy="input-befolkning"]').type(population);
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

  it("should allow an authenticated user to create a region", () => {
    const name = regionName("create");
    createRegionThroughUi(name, "12345");
    cy.intercept("GET", "/api/regions").as("getRegions");
    cy.visit("/#/regions");
    cy.wait("@getRegions").its("response.statusCode").should("eq", 200);
    cy.get('[data-cy="list-item"]').contains(name).should("be.visible");
  });

  it("should allow an authenticated user to update a region", () => {
    const originalName = regionName("update-original");
    const updatedName = regionName("update-complete");
    createRegionThroughUi(originalName, "12345").then((regionId) => {
      cy.intercept("GET", `/api/regions/${regionId}`).as("getRegion");
      cy.intercept("PUT", `/api/regions/${regionId}`).as("updateRegion");
      cy.visit(`/#/form/region/update/${regionId}`);
      cy.wait("@getRegion");
      cy.get('[data-cy="input-region"]').clear().type(updatedName);
      cy.get('[data-cy="input-befolkning"]').clear().type("54321");
      cy.get('[data-cy="submit-form"]').click();
      cy.wait("@updateRegion").then(({ request, response }) => {
        expect(response?.statusCode).to.eq(200);
        expect(request.headers.authorization).to.match(/^Bearer .+/);
        expect(response?.body[0]).to.include({
          regions_id: regionId,
          regions_name: updatedName,
          regions_population: 54321,
        });
      });
      cy.contains("Du har uppdaterat en region").should("be.visible");
      cy.intercept("GET", `/api/regions/${regionId}`).as("getUpdatedRegion");
      cy.visit(`/#/detail/region/${regionId}`);
      cy.wait("@getUpdatedRegion").its("response.body.0").should("include", {
        regions_id: regionId,
        regions_name: updatedName,
        regions_population: 54321,
      });
      cy.contains(updatedName).should("be.visible");
    });
  });

  it("should allow an authenticated user to delete a region", () => {
    const name = regionName("delete");
    createRegionThroughUi(name, "12345").then((regionId) => {
      cy.intercept("GET", `/api/regions/${regionId}`).as("getRegion");
      cy.intercept("DELETE", `/api/regions/${regionId}`).as("deleteRegion");
      cy.visit(`/#/detail/region/${regionId}`);
      cy.wait("@getRegion");
      cy.on("window:confirm", () => true);
      cy.get('[data-cy="delete-item"]').click();
      cy.wait("@deleteRegion").then(({ request, response }) => {
        expect(response?.statusCode).to.eq(200);
        expect(request.headers.authorization).to.match(/^Bearer .+/);
        expect(response?.body[0].regions_id).to.eq(regionId);
      });
      cy.contains("Du har tagit bort en region").should("be.visible");

      cy.request({
        method: "GET",
        url: `/api/regions/${regionId}`,
        failOnStatusCode: false,
      })
        .its("status")
        .should("eq", 404);

      cy.visit("/#/regions");
      cy.contains('[data-cy="list-item"]', name).should("not.exist");
    });
  });

  it("should not be able to delete a region that has municipalities attached to it", () => {
    const nameRegion = regionName("foreign-key-region");
    const nameMunicipality = municipalityName("foreign-key-municipality");
    createRegionThroughUi(nameRegion, "12345").then((regionId) => {
      createMunicipalityThroughUi(nameMunicipality, "12345", regionId).then(
        (municipalityId) => {
          cy.intercept("GET", `/api/regions/${regionId}`).as("getRegion");
          cy.intercept("DELETE", `/api/regions/${regionId}`).as("deleteRegion");

          cy.on("window:confirm", () => true);

          cy.visit(`/#/detail/region/${regionId}`);

          cy.wait("@getRegion");

          cy.get('[data-cy="delete-item"]').click();

          cy.wait("@deleteRegion").then(({ response }) => {
            expect(response?.statusCode).to.eq(409);
          });

          cy.get('[data-cy="region-detail-error"]').should(
            "have.text",
            "Du kan inte ta bort regionen eftersom den har kommuner.",
          );

          cy.intercept("GET", `/api/municipalities/${municipalityId}`).as(
            "getOneMunicipality",
          );

          cy.visit(`/#/detail/municipality/${municipalityId}`);
          cy.wait("@getOneMunicipality").then(({ response }) => {
            expect(response?.statusCode).to.eq(200);
          });
        },
      );
    });
  });

  it("should send 404 when requested id is missing", () => {
    const missingRegionId = 1000000;
    cy.intercept("GET", `/api/regions/${missingRegionId}`).as("getRegion");

    cy.visit(`/#/detail/region/${missingRegionId}`);

    cy.wait("@getRegion").then(({ response }) => {
      expect(response?.statusCode).to.eq(404);
      expect(response?.body).to.contain({ error: "Kunde inte hitta regionen" });
    });

    cy.get('[data-cy="region-detail-error"]').should(
      "have.text",
      "Kunde inte hitta regionen",
    );

    cy.get('[data-cy="edit-item"]').should("not.exist");
    cy.get('[data-cy="delete-item"]').should("not.exist");
  });
});
