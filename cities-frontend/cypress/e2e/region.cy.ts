describe("region", () => {
  let createdRegionId: number | undefined;

  const regionName = (suffix: string) => `${suffix}${Cypress._.random(10)}`;

  beforeEach(() => cy.loginByFirebase());

  afterEach(() => {
    if (!createdRegionId) return;
    cy.getFirebaseIdToken().then((token) => {
      cy.request({
        method: "DELETE",
        url: `/api/regions/${createdRegionId}`,
        headers: { Authorization: `Bearer ${token}` },
        failOnStatusCode: false,
      })
        .its("status")
        .should("be.oneOf", [200, 404]);
    });
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

  it("should allow an authenticated user to create a region", () => {
    const name = regionName("create");
    createRegionThroughUi(name, "12345");
    cy.intercept("GET", "/api/regions").as("getRegions");
    cy.visit("/#/regions");
    cy.wait("@getRegions").its("response.statusCode").should("eq", 200);
    cy.get('[data-cy="list-item"]').contains(name).should("be.visible");
  });

  it("should allow an authenticated user to update a city", () => {
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
      createdRegionId = undefined;
      cy.contains("Du har tagit bort en region").should("be.visible");
      cy.request(`/api/regions/${regionId}`)
        .its("body")
        .should("deep.equal", []);
      cy.visit("/#/regions");
      cy.contains('[data-cy="list-item"]', name).should("not.exist");
    });
  });
});
