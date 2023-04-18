/// <reference types="Cypress" />
import '../../support/commands';

describe('Page Logout', () => {

  beforeEach(() => {
    cy.login();
    cy.visit('/');
  });

  it('Vérifier les informations affichées', () => {
    cy.logout();

    cy.contains('Available Data').should('exist');
    cy.contains('Kids First Data Resource Portal').should('exist');
  });
});
