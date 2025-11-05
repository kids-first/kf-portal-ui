/// <reference types="cypress"/>
import '../../support/commands';

beforeEach(() => {
  cy.login();
  cy.visitDataExploration('datafiles', '?sharedFilterId=4fec6182-edd8-4937-8a80-6f790d7df665');
  cy.get('[data-cy="SidebarMenuItem_Data File"]').clickAndWait({force: true});
  cy.get('[class*="Filters_filterExpandBtnWrapper"] button[class*="ant-btn-link"]').clickAndWait({force: true}); //data-cy="ExpandAll"
  cy.get('[class*="Filters_filterExpandBtnWrapper"] button[class*="ant-btn-link"]').contains('Collapse all').should('exist'); //data-cy="ExpandAll"
});

describe('Page Data Exploration (Data Files) - Filtrer avec les facettes', () => {
  it('Expand all/Collapse all', () => {
    cy.get('[class*="Filters_filterExpandBtnWrapper"] button[class*="ant-btn-link"]').contains('Collapse all').should('exist'); //data-cy="ExpandAll"
    cy.get('section[class*="Filters"] [aria-expanded="true"]').should('exist');
    cy.get('section[class*="Filters"] [aria-expanded="false"]').should('not.exist');

    cy.get('[class*="Filters_filterExpandBtnWrapper"] button[class*="ant-btn-link"]').clickAndWait({force: true}); //data-cy="ExpandAll"
    cy.get('[class*="Filters_filterExpandBtnWrapper"] button[class*="ant-btn-link"]').contains('Expand all').should('exist'); //data-cy="ExpandAll"
    cy.get('section[class*="Filters"] [aria-expanded="false"]').should('exist');
    cy.get('section[class*="Filters"] [aria-expanded="true"]').should('not.exist');
  });

  it('Search by file ID - GF_6DVS70V9', () => {
    cy.get('[class*="SearchLabel_title"]').contains('Search by File ID').should('exist'); //data-cy="SearchLabel_Title"

    cy.typeAndIntercept('[class*="ant-select-show-search"]', 'gf_6dvs70v9', 'POST', '*/grapgql', 3, 0); //data-cy="SearchAutocomplete_Select"
    cy.get('[class*="ant-select-dropdown"] [class*="ant-select-item"]').contains('GF_6DVS70V9').should('exist'); //data-cy="Search_Dropdown"
    cy.get('[class*="ant-select-dropdown"] [class*="ant-select-item"]').eq(0).click({force: true}); //data-cy="Search_Dropdown"

    cy.get('[class*="ant-select-show-search"] [class="ant-tag"]').contains('GF_6DVS70V9').should('exist'); //data-cy="Tag_GF_6DVS70V9"
    cy.get('[class*="QueryBar_selected"] [class*="QueryPill_field"]').contains('File ID').should('exist');
    cy.get('[class*="QueryBar_selected"] [class*="QueryValues_value"]').contains('GF 6DVS70V9').should('exist');
    cy.validateTableResultsCount(/^1 Result$/);

    cy.get('[data-icon="close-circle"]').clickAndWait({force: true});
    cy.get('[class*="ant-select-show-search"] [class="ant-tag"]').should('not.exist'); //data-cy="Tag_GF_6DVS70V9"
  });

  it('Access - Controlled', () => {
    cy.validateFacetFilter('Access', 'Controlled', 'Controlled', /\d{1}/, 1);
    cy.validateFacetRank(0, 'Access');
  });

  it('Data Category - Genomics', () => {
    cy.validateFacetFilter('Data Category', 'Genomics', 'Genomics', /\d{1}/, 1);
    cy.validateFacetRank(1, 'Data Category');
  });

  it('Data Type - GVCF', () => {
    cy.validateFacetFilter('Data Type', 'GVCF', 'gVCF', /\d{1}/, 1);
    cy.validateFacetRank(2, 'Data Type');
  });

  it('Experimental Strategy - Whole Genome Sequencing', () => {
    cy.validateFacetFilter('Experimental Strategy', 'Whole Genome Sequencing', 'Whole Genome Sequencing', /\d{1}/, 1);
    cy.validateFacetRank(3, 'Experimental Strategy');
  });

  it('File Format - VCF', () => {
    cy.validateFacetFilter('File Format', 'Vcf', 'vcf', /\d{1}/, 1);
    cy.validateFacetRank(4, 'File Format');
  });

  it('Platform - Illumina', () => {
    cy.validateFacetFilter('Platform', 'Illumina', 'Illumina', /\d{1}/, 1);
    cy.validateFacetRank(5, 'Platform');
  });

  it('Instrument Model - HiSeq X Ten', () => {
    cy.validateFacetFilter('Instrument Model', 'HiSeq X Ten', 'HiSeq X Ten', /\d{1}/, 1);
    cy.validateFacetRank(6, 'Instrument Model');
  });

  it('Library Strand - Unstranded', () => {
    cy.validateFacetFilter('Library Strand', 'Unstranded', 'Unstranded', /\d{1}/, 1);
    cy.validateFacetRank(7, 'Library Strand');
  });

  it('Is Paired End - Controlled', () => {
    cy.get('[aria-expanded="true"] [data-cy="FilterContainer_Is Paired End"]').should('exist');
    cy.wait(1000);
    cy.clickAndIntercept('input[type="radio"][value="true"]', 'POST', '**/graphql', 12);
    cy.validatePillSelectedQuery('Is Paired End', ['True'], 1);
    cy.validateTableResultsCount(/\d{1}/);
    cy.validateFacetRank(8, 'Is Paired End');
  });

  it('Repository - Dcf', () => {
    cy.validateFacetFilter('Repository', 'Dcf', 'dcf', /\d{1}/, 1);
    cy.validateFacetRank(9, 'Repository');
  });

  it('ACL - Phs002330.c1', () => {
    cy.validateFacetFilter('ACL', 'Phs002330.c1', 'phs002330.c1', /\d{1}/, 1);
    cy.validateFacetRank(10, 'ACL');
  });
});
