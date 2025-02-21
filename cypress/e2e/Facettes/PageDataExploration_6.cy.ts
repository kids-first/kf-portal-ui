/// <reference types="cypress"/>
import '../../support/commands';

beforeEach(() => {
  cy.login();
  cy.visitDataExploration('datafiles');
  cy.get('[data-cy="SidebarMenuItem_Data File"]').clickAndWait({force: true});
  cy.get('[class*="Filters_filterExpandBtnWrapper"] button[class*="ant-btn-link"]').clickAndWait({force: true}); //data-cy="ExpandAll"
  cy.get('[class*="Filters_filterExpandBtnWrapper"] button[class*="ant-btn-link"]').contains('Collapse all').should('exist'); //data-cy="ExpandAll"
});

describe('Page Data Exploration (Data Files) - Filtrer avec les facettes', () => {
  it('Image Modality - MR', () => {
    cy.validateFacetFilter('Image Modality', 'MR', 'MR', /\d{1}/);
    cy.validateFacetRank(11, 'Image Modality');
  });

  it('Sequence Type - T1', () => {
    cy.validateFacetFilter('Sequence Type', 'T1', 'T1', /\d{1}/);
    cy.validateFacetRank(12, 'Sequence Type');
  });

  it('Technique - Structural', () => {
    cy.validateFacetFilter('Technique', 'Structural', 'Structural', /\d{1}/);
    cy.validateFacetRank(13, 'Technique');
  });

  it('Body Part Examined - CTSPINE', () => {
    cy.validateFacetFilter('Body Part Examined', 'CTSPINE', 'CTSPINE', /\d{1}/);
    cy.validateFacetRank(14, 'Body Part Examined');
  });

  it('Magnetic Field Strength', () => {
    cy.validateFacetNumFilter('Min', 'Magnetic Field Strength', '2', /\d{1}/, true);
    cy.validateFacetRank(15, 'Magnetic Field Strength');
  });

  it('Device Manufacturer - Siemens', () => {
    cy.validateFacetFilter('Device Manufacturer', 'Siemens', 'Siemens', /\d{1}/);
    cy.validateFacetRank(16, 'Device Manufacturer');
  });

  it('Device Model - Skyra', () => {
    cy.validateFacetFilter('Device Model', 'Skyra', 'Skyra', /\d{1}/);
    cy.validateFacetRank(17, 'Device Model');
  });
});
