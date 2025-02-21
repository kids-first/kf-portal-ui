/// <reference types="cypress"/>
import '../../support/commands';

beforeEach(() => {
  cy.login();
  cy.visitDashboard();
});

describe('Page Dashboard - Widget Saved Sets', () => {
  it('Vérifier les informations affichées - Tooltip', () => {
    cy.get('[class*="DashboardCards_dashboardCard"]').each(($el: JQuery<HTMLElement>) => {
      if ($el.text().includes('Saved Sets')) {
        cy.wrap($el).find('[class*="CardHeader_infoIcon"]').trigger('mouseover', {eventConstructor: 'MouseEvent', force: true});
      }
    });
    cy.get('[class="ant-popover-title"]').contains('Managing Saved Sets').should('exist');
    cy.get('[class="ant-popover-inner-content"]').contains('A saved set is a collection of one or more entity IDs which can be saved and revisited for later use. You can create saved sets at the top of the table of results in the ').should('exist');
  });

  it('Valider les liens disponibles - Data Exploration du Tooltip', () => {
    cy.get('[class*="DashboardCards_dashboardCard"]').each(($el: JQuery<HTMLElement>) => {
      if ($el.text().includes('Saved Sets')) {
        cy.wrap($el).find('[class*="CardHeader_infoIcon"]').trigger('mouseover', {eventConstructor: 'MouseEvent', force: true});
      }
    });
    cy.get('a[href]').contains('Data Exploration').clickAndWait({force: true});
    cy.get('[class*="PageContent_title"]').contains('Data Exploration').should('exist');
  });

  it('Valider les liens disponibles - Variants Exploration du Tooltip', () => {
    cy.get('[class*="DashboardCards_dashboardCard"]').each(($el: JQuery<HTMLElement>) => {
      if ($el.text().includes('Saved Sets')) {
        cy.wrap($el).find('[class*="CardHeader_infoIcon"]').trigger('mouseover', {eventConstructor: 'MouseEvent', force: true});
      }
    });
    cy.get('a[href]').contains('Variants Exploration').clickAndWait({force: true});
    cy.get('[class*="PageContent_pageHeaderTitle"]').contains('Variant Exploration').should('exist');
    cy.get('[class*="PageContent_pageHeader"]').contains('Germline').should('exist');
  });
});
