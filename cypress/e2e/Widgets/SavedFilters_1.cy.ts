/// <reference types="cypress"/>
import '../../support/commands';

beforeEach(() => {
  cy.login();
  cy.visitDashboard();
});

describe('Page Dashboard - Widget Saved Filters', () => {
  it('Vérifier les informations affichées - Tooltip', () => {
    cy.get('[class*="DashboardCards_dashboardCard"]').each(($el: JQuery<HTMLElement>) => {
      if ($el.text().includes('Saved Filters')) {
        cy.wrap($el).find('[class*="CardHeader_infoIcon"]').trigger('mouseover', {eventConstructor: 'MouseEvent', force: true});
      }
    });
    cy.get('[class="ant-popover-title"]').contains('Managing Saved Filters').should('exist');
    cy.get('[class="ant-popover-inner-content"]').contains('A saved filter is a virtual query created by applying one or more filters to a data set. They can be saved and revisited for later use. You can create and manage saved filters from the query builder at the top of the ').should('exist');
  });

  it('Valider les liens disponibles - Data Exploration du Tooltip', () => {
    cy.get('[class*="DashboardCards_dashboardCard"]').each(($el: JQuery<HTMLElement>) => {
      if ($el.text().includes('Saved Filters')) {
        cy.wrap($el).find('[class*="CardHeader_infoIcon"]').trigger('mouseover', {eventConstructor: 'MouseEvent', force: true});
      }
    });
    cy.get('a[href]').contains('Data Exploration').clickAndWait({force: true});
    cy.get('[class*="PageContent_title"]').contains('Data Exploration').should('exist');
  });

  it('Valider les liens disponibles - Variants Exploration du Tooltip', () => {
    cy.get('[class*="DashboardCards_dashboardCard"]').each(($el: JQuery<HTMLElement>) => {
      if ($el.text().includes('Saved Filters')) {
        cy.wrap($el).find('[class*="CardHeader_infoIcon"]').trigger('mouseover', {eventConstructor: 'MouseEvent', force: true});
      }
    });
    cy.get('a[href]').contains('Variants Exploration').clickAndWait({force: true});
    cy.get('[class*="PageContent_pageHeaderTitle"]').contains('Variant Exploration').should('exist');
    cy.get('[class*="PageContent_pageHeader"]').contains('Germline').should('exist');
  });
});
