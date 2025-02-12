/// <reference types="cypress"/>
import '../../support/commands';

beforeEach(() => {
  cy.login();
});

describe('Page des variants (Somatic) (Pathogenicity) - Filtrer avec les facettes', () => {
  beforeEach(() => {
    cy.visitVariantsSomaticPage('?sharedFilterId=d9f2ccfa-9d56-40c1-899f-836d0546af6a');
    cy.get('[data-cy="SidebarMenuItem_Pathogenicity"]').clickAndWait({force: true});
    cy.get('[class*="Filters_filterExpandBtnWrapper"] button[class*="ant-btn-link"]').clickAndWait({force: true}); //data-cy="ExpandAll"
    cy.get('[class*="Filters_filterExpandBtnWrapper"] button[class*="ant-btn-link"]').contains('Collapse all').should('exist'); //data-cy="ExpandAll"
  });

  it('Expand all/Collapse all', () => {
    cy.get('section[class*="Filters"] [aria-expanded="true"]').should('exist');
    cy.get('section[class*="Filters"] [aria-expanded="false"]').should('not.exist');

    cy.get('[class*="Filters_filterExpandBtnWrapper"] button[class*="ant-btn-link"]').clickAndWait({force: true}); //data-cy="ExpandAll"
    cy.get('[class*="Filters_filterExpandBtnWrapper"] button[class*="ant-btn-link"]').contains('Expand all').should('exist'); //data-cy="ExpandAll"
    cy.get('section[class*="Filters"] [aria-expanded="false"]').should('exist');
    cy.get('section[class*="Filters"] [aria-expanded="true"]').should('not.exist');
  });

  it('COSMIC CMC', () => {
    cy.validateFacetNumFilter('Max', 'COSMIC CMC', '5', /^577$/, false, 1);
    cy.validateFacetRank(11, 'COSMIC CMC');
  });

  it('COSMIC CMC (Ratio)', () => {
    cy.validateFacetNumFilter('Max', 'COSMIC CMC (Ratio)', '0.01', /^720$/, false, 1);
    cy.validateFacetRank(12, 'COSMIC CMC (Ratio)');
  });

  it('COSMIC CMC Tier - 1', () => {
    cy.validateFacetFilter('COSMIC CMC Tier', '1', '1', /^9$/, 1);
    cy.validateFacetRank(13, 'COSMIC CMC Tier');
  });

  it('Hotspot - True', () => {
    cy.get('[aria-expanded="true"] [data-cy="FilterContainer_Hotspot"]').should('exist');
    cy.wait(1000);
    cy.clickAndIntercept('input[type="radio"][value="true"]', 'POST', '**/graphql', 6);
    cy.validateTableResultsCount('21');
    cy.validateFacetRank(14, 'Hotspot');
  });
});