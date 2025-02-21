/// <reference types="cypress"/>
import '../../support/commands';

beforeEach(() => {
  cy.login();
  cy.visitDataExploration('participants', '?sharedFilterId=4fec6182-edd8-4937-8a80-6f790d7df665');
  cy.get('[data-cy="SidebarMenuItem_Study"]').clickAndWait({force: true});
  cy.get('[class*="Filters_filterExpandBtnWrapper"] button[class*="ant-btn-link"]').clickAndWait({force: true}); //data-cy="ExpandAll"
  cy.get('[class*="Filters_filterExpandBtnWrapper"] button[class*="ant-btn-link"]').contains('Collapse all').should('exist'); //data-cy="ExpandAll"
});

describe('Page Data Exploration (Study) - Filtrer avec les facettes', () => {
  it('Expand all/Collapse all', () => {
    cy.get('[class*="Filters_filterExpandBtnWrapper"] button[class*="ant-btn-link"]').contains('Collapse all').should('exist'); //data-cy="ExpandAll"
    cy.get('section[class*="Filters"] [aria-expanded="true"]').should('exist');
    cy.get('section[class*="Filters"] [aria-expanded="false"]').should('not.exist');

    cy.get('[class*="Filters_filterExpandBtnWrapper"] button[class*="ant-btn-link"]').clickAndWait({force: true}); //data-cy="ExpandAll"
    cy.get('[class*="Filters_filterExpandBtnWrapper"] button[class*="ant-btn-link"]').contains('Expand all').should('exist'); //data-cy="ExpandAll"
    cy.get('section[class*="Filters"] [aria-expanded="false"]').should('exist');
    cy.get('section[class*="Filters"] [aria-expanded="true"]').should('not.exist');
  });

  it('Study Name - Kids First: Genomic Analysis of Congenital Diaphragmatic Hernia', () => {
    cy.validateFacetFilter('Study Name', 'Kids First: Genomic Analysis of Congenital Diaphragmatic Hernia', 'Kids First: Genomic Analysis of Congenital Diaphragmatic Hernia', /\d{1}/, 1);
    cy.validateFacetRank(0, 'Study Name');
  });

  it('Study Code - KF-CDH', () => {
    cy.get('[id="query-builder-header-tools"] [data-icon="plus"]').clickAndWait({force: true});
    cy.validateFacetFilter('Study Code', 'KF-CDH', 'KF-CDH', /\d{1}/, 0);
    cy.validateFacetRank(1, 'Study Code');
  });

  it('Study Program - Kids First', () => {
    cy.validateFacetFilter('Study Program', 'Kids First', 'Kids First', /\d{1}/, 1);
    cy.validateFacetRank(2, 'Study Program');
  });

  it('Study Domain - Birth Defect', () => {
    cy.validateFacetFilter('Study Domain', 'Birth Defect', 'BIRTHDEFECT', /\d{1}/, 1);
    cy.validateFacetRank(3, 'Study Domain');
  });

  it('dbGaP Accession Number - Phs001110', () => {
    cy.validateFacetFilter('dbGaP Accession Number', 'Phs001110', 'phs001110', /\d{1}/, 1);
    cy.validateFacetRank(4, 'dbGaP Accession Number');
  });
});
