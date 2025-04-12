/* eslint-disable no-undef */
describe('Navbar Navigation', () => {
  it('should navigate to Mapa das Hortas', () => {
    cy.visit('/');
    cy.get('a[href="/mapa-hortas"]').click();
    cy.url().should('include', '/mapa-hortas');
  });
});