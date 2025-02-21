/// <reference types="cypress"/>
import '../../support/commands';

beforeEach(() => {
  cy.login();
  cy.createBioReqIfNotExists('Cypress_BrB', 0);
  cy.visitDashboard();
});

describe('Page Dashboard - Widget Biospecimen Requests', () => {
  it('Vérifier les informations affichées - Nom', () => {
    cy.get('[class*="DashboardCards_dashboardCard"]').each(($el: JQuery<HTMLElement>) => {
      if ($el.text().includes('Biospecimen Requests')) {
        cy.wrap($el).as('dashboardCard');
      };
    });
    cy.get('@dashboardCard').contains('Cypress_BrB').should('exist');
  });

  it('Vérifier les informations affichées - Stamp', () => {
    cy.get('[class*="DashboardCards_dashboardCard"]').each(($el: JQuery<HTMLElement>) => {
      if ($el.text().includes('Biospecimen Requests')) {
        cy.wrap($el).as('dashboardCard');
      };
    });
    cy.get('@dashboardCard').contains('Last saved:').should('exist');
    cy.get('@dashboardCard').contains(' ago').should('exist');
  });

  it('Valider les liens disponibles - Nom', () => {
    cy.get('[class*="DashboardCards_dashboardCard"]').each(($el: JQuery<HTMLElement>) => {
      if ($el.text().includes('Biospecimen Requests')) {
        cy.wrap($el).as('dashboardCard');
      };
    });
    cy.get('@dashboardCard').contains('Cypress_BrB').clickAndWait({force: true});
    cy.get('[class*="Biospecimens_biospecimenTabWrapper"]').should('exist');
    cy.get('[class*="QueryBar_selected"] [class*="QueryPill_field"]').contains('Biospecimen').should('exist');
    cy.get('[class*="QueryBar_selected"] [class*="QueryValues_value"]').contains('Cypress_BrB').should('exist');
  });

  it('Valider les liens disponibles - Bouton Delete', () => {
    cy.get('[class*="DashboardCards_dashboardCard"]').each(($el: JQuery<HTMLElement>) => {
      if ($el.text().includes('Biospecimen Requests')) {
        cy.wrap($el).as('dashboardCard');
      };
    });
    cy.get('@dashboardCard').contains('Cypress_BrB').should('exist');
    cy.deleteBioReqIfExists('Cypress_BrB');
  });
});
