/// <reference types="cypress"/>
import '../../support/commands';

beforeEach(() => {
  cy.login();
  cy.visitDataExploration('participants', '?sharedFilterId=4fec6182-edd8-4937-8a80-6f790d7df665');
  cy.get('[data-cy="SidebarMenuItem_Clinical"]').clickAndWait({force: true});
  cy.get('[class*="Filters_filterExpandBtnWrapper"] button[class*="ant-btn-link"]').clickAndWait({force: true}); //data-cy="ExpandAll"
  cy.get('[class*="Filters_filterExpandBtnWrapper"] button[class*="ant-btn-link"]').contains('Collapse all').should('exist'); //data-cy="ExpandAll"
});

describe('Page Data Exploration (Clinical) - Filtrer avec les facettes', () => {
  it('Expand all/Collapse all', () => {
    cy.get('[class*="Filters_filterExpandBtnWrapper"] button[class*="ant-btn-link"]').contains('Collapse all').should('exist'); //data-cy="ExpandAll"
    cy.get('section[class*="Filters"] [aria-expanded="true"]').should('exist');
    cy.get('section[class*="Filters"] [aria-expanded="false"]').its('length').should('eq', 2);

    cy.get('[class*="Filters_filterExpandBtnWrapper"] button[class*="ant-btn-link"]').clickAndWait({force: true}); //data-cy="ExpandAll"
    cy.get('[class*="Filters_filterExpandBtnWrapper"] button[class*="ant-btn-link"]').contains('Expand all').should('exist'); //data-cy="ExpandAll"
    cy.get('section[class*="Filters"] [aria-expanded="false"]').should('exist');
    cy.get('section[class*="Filters"] [aria-expanded="true"]').should('not.exist');
  });

  it('Age at Diagnosis (days) - 1000', () => {
    cy.validateFacetNumFilter('Max', 'Age at Diagnosis (days)', '1000', /\d{1}/, true, 1);
    cy.validateFacetRank(0, 'Age at Diagnosis (days)');
  });

  it('Age at Vital Status (days) - 1000', () => {
    cy.validateFacetNumFilter('Max', 'Age at Vital Status (days)', '1000', /\d{1}/, true, 1);
    cy.validateFacetRank(1, 'Age at Vital Status (days)');
  });

  it('Age at Observed Phenotype (days) - 1000', () => {
    cy.validateFacetNumFilter('Max', 'Age at Observed Phenotype (days)', '1000', /\d{1}/, true, 1);
    cy.validateFacetRank(2, 'Age at Observed Phenotype (days)');
  });

  it('Diagnosis (MONDO)', () => {
    cy.get('div[class*="CollapsePlaceHolderFacet_collapseLikeFacet"]').eq(0).contains('Diagnosis (MONDO)').should('exist');
    // TODO Filtrer
  });

  it('Diagnosis (NCIT) - NCIT:C3270', () => {
    cy.validateFacetFilter('Diagnosis (NCIT)', 'Neuroblastoma (NCIT:C3270)', 'Neuroblastoma (NCIT:C3270)', /\d{1}/, 1);
    cy.validateFacetRank(3, 'Diagnosis (NCIT)');
  });

  it('Diagnosis (Source Text) - Down syndrome', () => {
    cy.validateFacetFilter('Diagnosis (Source Text)', 'Down syndrome', 'Down syndrome', /\d{1}/, 1);
    cy.validateFacetRank(4, 'Diagnosis (Source Text)');
  });

  it('Family Composition - Proband-only', () => {
    cy.validateFacetFilter('Family Composition', 'Proband-only', 'proband-only', /\d{1}/, 1);
    cy.validateFacetRank(5, 'Family Composition');
  });

  it('Observed Phenotype (HPO)', () => {
    cy.get('div[class*="CollapsePlaceHolderFacet_collapseLikeFacet"]').eq(1).contains('Observed Phenotype (HPO)').should('exist');
    // TODO Filtrer
  });

  it('Not Observed Phenotype (HPO) - Ventricular septal defect (HP:0001629)', () => {
    cy.validateFacetFilter('Not Observed Phenotype (HPO)', 'Ventricular septal defect (HP:0001629)', 'Ventricular septal defect (HP:0001629)', /\d{1}/, 1);
    cy.validateFacetRank(6, 'Not Observed Phenotype (HPO)');
  });

  it('Observed Phenotype (Source Text) - Neuroblastoma', () => {
    cy.validateFacetFilter('Observed Phenotype (Source Text)', 'Neuroblastoma', 'Neuroblastoma', /\d{1}/, 1);
    cy.validateFacetRank(7, 'Observed Phenotype (Source Text)');
  });

  it('Vital Status - Alive', () => {
    cy.validateFacetFilter('Vital Status', 'Alive', 'Alive', /\d{1}/, 1);
    cy.validateFacetRank(8, 'Vital Status');
  });
});
