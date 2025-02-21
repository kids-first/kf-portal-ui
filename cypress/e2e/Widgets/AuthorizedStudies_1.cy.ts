/// <reference types="cypress" />
import '../../support/commands';

beforeEach(() => {
  cy.login();
  cy.visitDashboard();
});

describe('Page Dashboard - Widget Authorized Studies (déconnecté)', () => {
  it('Vérifier les informations affichées - Tooltip', () => {
    cy.get('[class*="DashboardCards_dashboardCard"]').each(($el: JQuery<HTMLElement>) => {
      if ($el.text().includes('Authorized Studies')) {
        cy.wrap($el).find('[class*="CardHeader_infoIcon"]').trigger('mouseover', {eventConstructor: 'MouseEvent', force: true});
      }
    });
    cy.get('[class="ant-popover-title"]').contains('Accessing Data').should('exist');
    cy.get('[class="ant-popover-inner-content"]').contains('Users requesting access to controlled data are required to have an eRA Commons account. Read more on').should('exist');
  });

  it('Valider les liens disponibles - Applying du Tooltip', () => {
    cy.get('[class*="DashboardCards_dashboardCard"]').each(($el: JQuery<HTMLElement>) => {
      if ($el.text().includes('Authorized Studies')) {
        cy.wrap($el).find('[class*="CardHeader_infoIcon"]').trigger('mouseover', {eventConstructor: 'MouseEvent', force: true});
      }
    });
    cy.get('a[href="https://dbgap.ncbi.nlm.nih.gov/aa/wga.cgi?login=&page=login"]').contains('applying for data access').should('exist');
  });

  it('Vérifier les informations affichées - Carte', () => {
    cy.get('[class*="DashboardCards_dashboardCard"]').each(($el: JQuery<HTMLElement>) => {
      if ($el.text().includes('Authorized Studies')) {
        cy.wrap($el).find('[class*="Gridcard_contentWrapper"]').as('gridCard');
      }
    });
    cy.get('@gridCard').contains('To access controlled study files, connect to our data repository partners using your NIH credentials.').should('exist');
    cy.get('@gridCard').find('button').contains('Connect').should('exist');
  });
});
