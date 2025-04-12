/* eslint-disable no-undef */
describe('Form Validation', () => {
  it('should display error on empty required fields', () => {
    cy.visit('/inscricao');
    cy.get('button[type="submit"]').click();
    cy.contains('Nome é obrigatório').should('be.visible');
  });
});