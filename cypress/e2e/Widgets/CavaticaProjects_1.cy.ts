/// <reference types="cypress"/>
import '../../support/commands';

beforeEach(() => {
  cy.login();
  cy.visitDashboard();
});

describe('Page Dashboard - Widget Cavatica Projects (déconnecté)', () => {
  it('Vérifier les informations affichées - Tooltip', () => {
    cy.get('[class*="DashboardCards_dashboardCard"]').each(($el: JQuery<HTMLElement>) => {
      if ($el.text().includes('Cavatica Projects')) {
        cy.wrap($el).find('[class*="CardHeader_infoIcon"]').trigger('mouseover', {eventConstructor: 'MouseEvent', force: true});
      }
    });
    cy.get('[class="ant-popover-title"]').contains('CAVATICA Compute Cloud Platform').should('exist');
    cy.get('[class="ant-popover-inner-content"]').contains('CAVATICA is a cloud-based data analysis platform where data, results, and workflows are shared among the world’s research community.').should('exist');
  });

  it('Valider les liens disponibles - Read more du Tooltip', () => {
    cy.get('[class*="DashboardCards_dashboardCard"]').each(($el: JQuery<HTMLElement>) => {
      if ($el.text().includes('Cavatica Projects')) {
        cy.wrap($el).find('[class*="CardHeader_infoIcon"]').trigger('mouseover', {eventConstructor: 'MouseEvent', force: true});
      }
    });
    cy.get('a[href="https://www.cavatica.org/"]').contains('Read more').should('exist');
  });

  it('Vérifier les informations affichées - Carte', () => {
    cy.get('[class*="DashboardCards_dashboardCard"]').each(($el: JQuery<HTMLElement>) => {
      if ($el.text().includes('Cavatica Projects')) {
        cy.wrap($el).find('[class*="Gridcard_contentWrapper"]').as('gridCard');
      }
    });
    cy.get('@gridCard').contains('To analyze Kids First data on the cloud, connect to Cavatica.').should('exist');
    cy.get('@gridCard').find('button').contains('Connect').should('exist');
  });
});
