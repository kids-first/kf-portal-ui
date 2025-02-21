/// <reference types="cypress"/>
import '../../support/commands';

beforeEach(() => {
  cy.login();
  cy.visitDashboard();
});

describe('Page Dashboard - Widget Kids First FHIR API', () => {
  it('Vérifier les informations affichées - Tooltip', () => {
    cy.get('[class*="DashboardCards_dashboardCard"]').each(($el: JQuery<HTMLElement>) => {
      if ($el.text().includes('Kids First FHIR API')) {
        cy.wrap($el).find('[class*="CardHeader_infoIcon"]').trigger('mouseover', {eventConstructor: 'MouseEvent', force: true});
      }
    });
    cy.get('[class="ant-popover-title"]').contains('Query KF Data via FHIR API').should('exist');
    cy.get('[class="ant-popover-inner-content"]').contains('The HL7® FHIR® format defines how clinical health data for research can be made interoperable across different computer systems via an API regardless of how it is stored in those systems. The NIH encourages biomedical investigators to use the FHIR standard to support exchange of data between NCPI’s participating platforms.').should('exist');
  });

  it('Valider les liens disponibles - Read more du Tooltip', () => {
    cy.get('[class*="DashboardCards_dashboardCard"]').each(($el: JQuery<HTMLElement>) => {
      if ($el.text().includes('Kids First FHIR API')) {
        cy.wrap($el).find('[class*="CardHeader_infoIcon"]').trigger('mouseover', {eventConstructor: 'MouseEvent', force: true});
      }
    });
    cy.get('a[href="https://www.hl7.org/fhir/overview.html"]').contains('Read more').should('exist');
  });

  it('Vérifier les informations affichées - Carte', () => {
    cy.get('[class*="DashboardCards_dashboardCard"]').each(($el: JQuery<HTMLElement>) => {
      if ($el.text().includes('Kids First FHIR API')) {
        cy.wrap($el).find('[class*="Gridcard_contentWrapper"]').as('gridCard');
      }
    });

    cy.get('@gridCard').find('[class*="CaringForChildrenWithCovid_icon"]').should('exist');
    cy.get('@gridCard').contains('Query all released Kids First datasets via FHIR API').should('exist');
    cy.get('@gridCard').contains('Query the entire CARING dataset via FHIR API parameters').should('exist');

    cy.get('@gridCard').find('[class*="CaringForChildrenWithCovid_tooltipsText"]').trigger('mouseover', {eventConstructor: 'MouseEvent', force: true});
    cy.get('[class="ant-tooltip-inner"]').contains('FHIR & Data Resources for NIH\'s Collaboration to Assess Risk and Identify LoNG-term outcomes for Children with COVID').should('exist');
  });

  it('Valider les liens disponibles - Kids First FHIR API Endpoint', () => {
    cy.get('[class*="DashboardCards_dashboardCard"]').each(($el: JQuery<HTMLElement>) => {
      if ($el.text().includes('Kids First FHIR API')) {
        cy.wrap($el).find('[class*="Gridcard_contentWrapper"]').as('gridCard');
      }
    });
    cy.get('@gridCard').find('a[href="https://fhir.kidsfirstdrc.org/metadata"]').contains('Kids First FHIR API Endpoint').should('exist');
  });

  it('Valider les liens disponibles - CARING Data FHIR API Endpoint', () => {
    cy.get('[class*="DashboardCards_dashboardCard"]').each(($el: JQuery<HTMLElement>) => {
      if ($el.text().includes('Kids First FHIR API')) {
        cy.wrap($el).find('[class*="Gridcard_contentWrapper"]').as('gridCard');
      }
    });
    cy.get('@gridCard').find('a[href="https://fhir.kidsfirstdrc.org/Patient?_total=accurate&_has:ResearchSubject:individual:study=ResearchStudy/4873"]').contains('CARING Data FHIR API Endpoint').should('exist');
  });
});
