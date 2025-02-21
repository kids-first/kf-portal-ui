/// <reference types="cypress"/>
import '../../support/commands';

beforeEach(() => {
  cy.login();
  cy.createBioReqIfNotExists('Cypress_BrA', 0);
  cy.deleteBioReqIfExists('Cypress_BrB');
  cy.visitDashboard();
});

describe('Page Dashboard - Widget Biospecimen Requests', () => {
  it('Valider les liens disponibles - Bouton Edit', () => {
    cy.get('[class*="DashboardCards_dashboardCard"]').each(($el: JQuery<HTMLElement>) => {
      if ($el.text().includes('Biospecimen Requests')) {
        cy.wrap($el).as('dashboardCard');
      };
    });
    cy.get('@dashboardCard').find('[class*="ListItemWithActions_fuiListItemWithActions"]').each(($el: JQuery<HTMLElement>) => {
      if ($el.text().includes('Cypress_BrA')) {
        cy.wrap($el).find('svg[data-icon="edit"]').clickAndWait({force:true});
      };
    });
    cy.get('[class="ant-modal-content"] input[id="name"]').filter(':visible').clear().type('Cypress_BrB');
    cy.get(`[class="ant-modal-content"] input[value="Cypress_BrB"]`).should('exist');
    cy.clickAndIntercept('[class="ant-modal-content"] button[class*="ant-btn-primary"]', 'PUT', '**/sets/**', 1, true/*beVisible*/);

    cy.get('[class*="DashboardCards_dashboardCard"]').each(($el: JQuery<HTMLElement>) => {
      if ($el.text().includes('Biospecimen Requests')) {
        cy.wrap($el).as('dashboardCard');
      };
    });
    cy.get('@dashboardCard').contains('Cypress_BrB').should('exist');
    cy.get('@dashboardCard').contains('Cypress_BrA').should('not.exist');
  });
});
