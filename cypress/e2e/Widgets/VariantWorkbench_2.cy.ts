/// <reference types="cypress"/>
import '../../support/commands';

beforeEach(() => {
  cy.login();
  cy.intercept('GET', '**/fence/gen3/authenticated', {
    statusCode: 200,
    body: {
      "authenticated": true,
      "expiration": 1722785256
    },
  }).as('authStudiesAuthenticated');
  cy.intercept('POST', '**/authorized-studies', {
    statusCode: 200,
    body: {
      "gen3": {
          "data": [
              {
                  "study_id": "Study_ID",
                  "user_acl_in_study": [
                      "phs012345.cy",
                      "open_access"
                  ],
                  "study_code": "Study_Cypress",
                  "title": "Cypress: (Test) A mock study for Cypress tests",
                  "authorized_controlled_files_count": 1234,
                  "total_files_count": 5678,
                  "total_authorized_files_count": 3456
              }
          ],
          "error": false
      }
  },
  }).as('authStudiesList');

  cy.visitDashboard();
  cy.wait('@authStudiesAuthenticated');
  cy.wait('@authStudiesList');
});

describe('Page Dashboard - Widget Variant Workbench (connecté)', () => {
  it('Vérifier les informations affichées - Carte', () => {
    cy.get('[class*="DashboardCards_dashboardCard"]').each(($el: JQuery<HTMLElement>) => {
      if ($el.text().includes('Variant Workbench')) {
        cy.wrap($el).find('[class*="Gridcard_contentWrapper"]').as('gridCard');
      }
    });
    cy.get('@gridCard').find('[alt="Appache-Zeppelin-Logo"]').should('exist');
    cy.get('@gridCard').contains('Access the Kids First variant database within your own high-performance compute environment using Cavatica’s').should('exist');
    cy.get('@gridCard').contains('and combine participant clinical data with variant annotations. Copy a preloaded').should('exist');
    cy.get('@gridCard').contains('in Cavatica before launching.').should('exist');
    cy.get('@gridCard').find('button').contains('Launch in Cavatica').should('exist');
  });

  it('Valider les liens disponibles - Bouton Launch in Cavatica', () => {
    cy.get('[class*="DashboardCards_dashboardCard"]').each(($el: JQuery<HTMLElement>) => {
      if ($el.text().includes('Variant Workbench')) {
        cy.wrap($el).find('[class*="Gridcard_contentWrapper"]').as('gridCard');
      }
    });

    cy.intercept('GET', 'https://kf-cavatica-vwb-api-qa.kf-strides.org/vwb/manifest').as('cavaticaVwbManifest');
    cy.get('@gridCard').find('button').clickAndWait({force: true});
    cy.wait('@cavaticaVwbManifest');
  });
});
