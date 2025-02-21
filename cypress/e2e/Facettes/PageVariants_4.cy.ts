/// <reference types="cypress"/>
import '../../support/commands';

beforeEach(() => {
  cy.login();
  cy.visitVariantsPage('?sharedFilterId=efbd0b69-3d16-4796-af2a-d590cdb99d1e');
  cy.get('[data-cy="SidebarMenuItem_Gene"]').clickAndWait({force: true});
  cy.get('[class*="Filters_filterExpandBtnWrapper"] button[class*="ant-btn-link"]').clickAndWait({force: true}); //data-cy="ExpandAll"
  cy.get('[class*="Filters_filterExpandBtnWrapper"] button[class*="ant-btn-link"]').contains('Collapse all').should('exist'); //data-cy="ExpandAll"
});

describe('Page des variants (Gene) - Filtrer avec les facettes', () => {
  it('Expand all/Collapse all', () => {
    cy.get('section[class*="Filters"] [aria-expanded="true"]').should('exist');
    cy.get('section[class*="Filters"] [aria-expanded="false"]').should('not.exist');

    cy.get('[class*="Filters_filterExpandBtnWrapper"] button[class*="ant-btn-link"]').clickAndWait({force: true}); //data-cy="ExpandAll"
    cy.get('[class*="Filters_filterExpandBtnWrapper"] button[class*="ant-btn-link"]').contains('Expand all').should('exist'); //data-cy="ExpandAll"
    cy.get('section[class*="Filters"] [aria-expanded="false"]').should('exist');
    cy.get('section[class*="Filters"] [aria-expanded="true"]').should('not.exist');
  });

  it('Search by gene symbol - SEMA4A [SKFP-939]', () => {
    cy.get('[class*="SearchLabel_title"]').contains('Search by gene').should('exist'); //data-cy="SearchLabel_Title"

    cy.get('[class*="SearchLabel_tooltipIcon"]').trigger('mouseover', {eventConstructor: 'MouseEvent', force: true}); //data-cy="SearchLabel_InfoCircleOutlined"
    cy.get('div[class="ant-tooltip-inner"]').contains('Enter a Gene Symbol, Gene Alias or Ensemble ID').should('exist');

    cy.typeAndIntercept('[class*="ant-select-show-search"]', 'sema4a', 'POST', '*/grapgql', 2); //data-cy="SearchAutocomplete_Select"
    cy.get('[class*="ant-select-dropdown"] [class*="ant-select-item"]').contains('SEMA4A').should('exist'); //data-cy="Search_Dropdown"
    cy.get('[class*="ant-select-dropdown"] [class*="ant-select-item"]').eq(0).clickAndWait({force: true}); //data-cy="Search_Dropdown"

    cy.get('[class="ant-tag"]').contains('SEMA4A').should('exist'); //data-cy="Tag_SEMA4A"
    cy.get('[class*="QueryBar_selected"] [class*="QueryPill_field"]').contains('Gene').should('exist');
    cy.get('[class*="QueryBar_selected"] [class*="QueryValues_value"]').contains('SEMA4A').should('exist');
    cy.validateTableResultsCount(/^353$/);

    cy.get('[data-icon="close-circle"]').clickAndWait({force: true});
    cy.get('[class*="ant-select-show-search"] [class="ant-tag"]').should('not.exist'); //data-cy="Tag_SEMA4A"
  });

  it('Search by gene alias - SEMAB', () => {
    cy.typeAndIntercept('[class*="ant-select-show-search"]', 'semab', 'POST', '* /grapgql', 2); //data-cy="SearchAutocomplete_Select"
    cy.get('[class*="ant-select-dropdown"] [class*="ant-select-item"]').contains('SEMA4A').should('exist'); //data-cy="Search_Dropdown"
    cy.get('[class*="ant-select-dropdown"] [class*="ant-select-item"]').eq(0).clickAndWait({force: true}); //data-cy="Search_Dropdown"

    cy.get('[class="ant-tag"]').contains('SEMA4A').should('exist'); //data-cy="Tag_SEMA4A"
    cy.get('[class*="QueryBar_selected"] [class*="QueryPill_field"]').contains('Gene').should('exist');
    cy.get('[class*="QueryBar_selected"] [class*="QueryValues_value"]').contains('SEMA4A').should('exist');
    cy.validateTableResultsCount(/^353$/);

    cy.get('[data-icon="close-circle"]').clickAndWait({force: true});
    cy.get('[class*="ant-select-show-search"] [class="ant-tag"]').should('not.exist'); //data-cy="Tag_SEMA4A"
  });

  it('Search by Ensembl ID - ENSG00000196189', () => {
    cy.typeAndIntercept('[class*="ant-select-show-search"]', 'ensg00000196189', 'POST', '* /grapgql', 2); //data-cy="SearchAutocomplete_Select"
    cy.get('[class*="ant-select-dropdown"] [class*="ant-select-item"]').contains('SEMA4A').should('exist'); //data-cy="Search_Dropdown"
    cy.get('[class*="ant-select-dropdown"] [class*="ant-select-item"]').eq(0).clickAndWait({force: true}); //data-cy="Search_Dropdown"

    cy.get('[class="ant-tag"]').contains('SEMA4A').should('exist'); //data-cy="Tag_SEMA4A"
    cy.get('[class*="QueryBar_selected"] [class*="QueryPill_field"]').contains('Gene').should('exist');
    cy.get('[class*="QueryBar_selected"] [class*="QueryValues_value"]').contains('SEMA4A').should('exist');
    cy.validateTableResultsCount(/^353$/);

    cy.get('[data-icon="close-circle"]').clickAndWait({force: true});
    cy.get('[class*="ant-select-show-search"] [class="ant-tag"]').should('not.exist'); //data-cy="Tag_SEMA4A"
  });

  it('Gene Type - Protein Coding', () => {
    cy.validateFacetFilter('Gene Type', 'Protein Coding', 'protein_coding', /^6,033,444$/, 1);
    cy.validateFacetRank(0, 'Gene Type');
  });

  it('Gene External Reference - OMIM', () => {
    cy.validateFacetFilter('Gene External Reference', 'OMIM', 'OMIM', /^1,793,110$/, 1);
    cy.validateFacetRank(1, 'Gene External Reference');
  });

  it('gnomAD pLI', () => {
    cy.validateFacetNumFilter('Min', 'gnomAD pLI', '0.01', /^2,796,791$/, false, 1);
    cy.validateFacetRank(2, 'gnomAD pLI');
  });

  it('gnomAD LOEUF', () => {
    cy.validateFacetNumFilter('Max', 'gnomAD LOEUF', '0.05', /^7,323$/, false, 1);
    cy.validateFacetRank(3, 'gnomAD LOEUF');
  });

  it('HPO - Autosomal recessive inheritance (HP:0000007)', () => {
    cy.get('[data-cy="FilterContainer_HPO"]').should('exist');
    cy.validateFacetRank(4, 'HPO');
    /* Fait planter Cypress
    cy.validateFacetFilter('HPO', 'Autosomal recessive inheritance (HP:0000007)', 'Autosomal recessive inheritance (HP:0000007)', /^47,253$/, 1);
    */
  });

  it('ORPHANET - Retinitis pigmentosa', () => {
    cy.get('[data-cy="FilterContainer_ORPHANET"]').should('exist');
    cy.validateFacetRank(5, 'ORPHANET');
    /* Fait planter Cypress
    cy.validateFacetFilter('ORPHANET', 'Retinitis pigmentosa', 'Retinitis pigmentosa', /^2,816$/, 1);
    */
  });

  it('OMIM - Spinocerebellar ataxia 37', () => {
    cy.get('[data-cy="FilterContainer_OMIM"]').should('exist');
    cy.validateFacetRank(6, 'OMIM');
    /* Fait planter Cypress
    cy.validateFacetFilter('OMIM', 'Spinocerebellar ataxia 37', 'Spinocerebellar ataxia 37', /^3,006$/, 1);
    */
  });

  it('DDD - Disordered cortical neuronal migration', () => {
    cy.validateFacetFilter('DDD', 'Disordered cortical neuronal migration', 'Disordered cortical neuronal migration', /^16,382$/, 1);
    cy.validateFacetRank(7, 'DDD');
  });

  it('COSMIC - Leukaemia', () => {
    cy.validateFacetFilter('COSMIC', 'Leukaemia', 'leukaemia', /^1,584$/, 1);
    cy.validateFacetRank(8, 'COSMIC');
  });
});
