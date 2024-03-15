/// <reference types="Cypress" />
import '../../support/commands';

beforeEach(() => {
  cy.login();
});

describe('Page des études - Filtrer avec les facettes', () => {
  beforeEach(() => {
    cy.visitStudiesPage();
  });

  it('Expand all/Collapse all', () => {
    cy.get('[class*="Filters_filterExpandBtnWrapper"] button[class*="ant-btn-link"]').contains('Collapse all').should('exist'); //data-cy="ExpandAll"
    cy.get('section[class*="Filters"] [aria-expanded="true"]').should('exist');
    cy.get('section[class*="Filters"] [aria-expanded="false"]').should('not.exist');

    cy.get('[class*="Filters_filterExpandBtnWrapper"] button[class*="ant-btn-link"]').click({force: true}); //data-cy="ExpandAll"
    cy.get('[class*="Filters_filterExpandBtnWrapper"] button[class*="ant-btn-link"]').contains('Expand all').should('exist'); //data-cy="ExpandAll"
    cy.get('section[class*="Filters"] [aria-expanded="false"]').should('exist');
    cy.get('section[class*="Filters"] [aria-expanded="true"]').should('not.exist');
  });

  it('Search by study - KF-CHD', () => {
    cy.get('[class*="SearchLabel_title"]').contains('Search by study').should('exist'); //data-cy="SearchLabel_Title"

    cy.get('[class*="SearchLabel_tooltipIcon"]').trigger('mouseover', {eventConstructor: 'MouseEvent', force: true}); //data-cy="SearchLabel_InfoCircleOutlined"
    cy.get('div[class="ant-tooltip-inner"]').contains('Search by Study Code, Study Name, dbGaP Accession Number').should('exist');

    cy.typeAndIntercept('[class*="ant-select-show-search"]', 'KF-CHD', 'POST', '*/grapgql', 2); //data-cy="SearchAutocomplete_Select"
    cy.wait(1000);
    cy.get('[class*="ant-select-dropdown"]').contains('KF-CHD').should('exist'); //data-cy="Search_Dropdown"
    cy.get('[class*="ant-select-dropdown"]').find('div[class*="ant-select-item"]').eq(0).click({force: true}); //data-cy="Search_Dropdown"

    cy.get('[class*="ant-select-show-search"] [class="ant-tag"]').should('exist'); //data-cy="Tag_KF-CHD"
    cy.get('[class*="QueryBar_selected"]').find('[class*="QueryPill_field"]').contains('Study Code').should('exist');
    cy.get('[class*="QueryBar_selected"]').find('[class*="QueryValues_value"]').contains('KF-CHD').should('exist');
    cy.validateTableResultsCount(/^1 Results$/);

    cy.get('[data-icon="close-circle"]').click({force: true});
    cy.get('[class*="ant-select-show-search"] [class="ant-tag"]').should('not.exist'); //data-cy="Tag_KF-CHD"
  });

  it('Program - Kids First', () => {
    cy.validateFacetFilter('Program', 'Kids First', 'Kids First', /^11 Results$/, 0, false);
    cy.validateFacetRank(0, 'Program');
  });

  it('Domain - Cancer and Birth Defect', () => {
    cy.validateFacetFilter('Domain', 'Cancer and Birth Defect', 'CANCERANDBIRTHDEFECT', /^2 Results$/, 0, false);
    cy.validateFacetRank(1, 'Domain');
  });

  it('Data Category - Transcriptomics', () => {
    cy.validateFacetFilter('Data Category', 'Transcriptomics', 'Transcriptomics', /^3 Results$/, 0, false);
    cy.validateFacetRank(2, 'Data Category');
  });

  it('Experimental Strategy - RNA-Seq', () => {
    cy.validateFacetFilter('Experimental Strategy', 'RNA-Seq', 'RNA-Seq', /^3 Results$/, 0, false);
    cy.validateFacetRank(3, 'Experimental Strategy');
  });

  it('Family Data - False', () => {
    cy.get('[aria-expanded="true"] [data-cy="FilterContainer_Family Data"]').should('exist');
    cy.wait(1000);
    cy.clickAndIntercept('input[type="radio"][value="false"]', 'POST', '**/graphql', 7);
    cy.validatePillSelectedQuery('Family Data', ['False']);
    cy.validateTableResultsCount(/^1$/);
    cy.validateFacetRank(4, 'Family Data');
  });
});
