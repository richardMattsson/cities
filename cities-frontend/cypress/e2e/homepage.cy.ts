describe("homepage", () => {
  it("show homepage and statistic data", function () {
    cy.visit("http://localhost:5173/");
    cy.get('#root ul.home-ul a[href="#/cities"] li').should("be.visible");
    cy.get('#root ul.home-ul a[href="#/municipalities"] li').should(
      "be.visible",
    );
    cy.get('#root ul.home-ul a[href="#/regions"] li').should("be.visible");
  });
});
