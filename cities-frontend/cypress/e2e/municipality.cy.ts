describe("municipality", () => {
  let createdKommunId: number | undefined;

  const kommunName = (suffix: string) => `${suffix}${Cypress._.random(10)}`;

  beforeEach(() => cy.loginByFirebase());

  afterEach(() => {
    if (!createdKommunId) return;
    cy.getFirebaseIdToken().then((token) => {
      cy.request({
        method: "DELETE",
        url: `/api/municipalities/${createdKommunId}`,
        headers: { Authorization: `Bearer ${token}` },
        failOnStatusCode: false,
      })
        .its("status")
        .should("be.oneOf", [200, 404]);
    });
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
      createdKommunId = response?.body[0].municipalities_id;
      expect(createdKommunId, "created municipality id").to.be.a("number");
      return createdKommunId!;
    });
  }

  it("should allow an authenticated user to create a municipality", () => {
    const name = kommunName("create");
    createMunicipalityThroughUi(name, "12345");
    cy.intercept("GET", "/api/municipalities").as("getMunicipalities");
    cy.visit("/#/municipalities");
    cy.wait("@getMunicipalities").its("response.statusCode").should("eq", 200);
    cy.get('[data-cy="list-item"]').contains(name).should("be.visible");
  });

  it("should allow an authenticated user to update a municipality", () => {
    const originalName = kommunName("update-original");
    const updatedName = kommunName("update-complete");
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
    const name = kommunName("delete");
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
      createdKommunId = undefined;
      cy.contains("Du har tagit bort en kommun").should("be.visible");
      cy.request(`/api/municipalities/${municipalityId}`)
        .its("body")
        .should("deep.equal", []);
      cy.visit("/#/municipalities");
      cy.contains('[data-cy="list-item"]', name).should("not.exist");
    });
  });
});
