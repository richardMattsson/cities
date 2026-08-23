describe("filter", () => {
  it("visits the city page and finds a city with the search input", () => {
    cy.visit("/");
    cy.get('#root nav.Navbar-nav a[href="#/cities"] li').click();
    cy.get('[data-cy="list-search"]').should("be.visible");
    cy.get('[data-cy="list-search"]').should("be.enabled");
    cy.get('[data-cy="list-search"]').type("Göteborg");
    cy.get('[data-cy="list-item"]').should("have.text", "Göteborg Centrum ");
  });

  it("visits the municipality page and finds a municipality with the search input", () => {
    cy.visit("/");
    cy.get('#root nav.Navbar-nav a[href="#/municipalities"] li').click();
    cy.get('[data-cy="list-search"]').should("be.visible");
    cy.get('[data-cy="list-search"]').should("be.enabled");
    cy.get('[data-cy="list-search"]').type("Arvika");
    cy.get('[data-cy="list-item"]').should("have.text", "Arvika ");
  });

  it("visits the regions page and finds a ragion with the search input", () => {
    cy.visit("/");
    cy.get('#root nav.Navbar-nav a[href="#/regions"] li').click();
    cy.get('[data-cy="list-item"]').should("be.visible");
    cy.get('[data-cy="list-search"]').should("be.enabled");
    cy.get('[data-cy="list-search"]').type("Blekinge");
    cy.get('[data-cy="list-item"]').should("have.text", "Blekinge ");
  });
});
