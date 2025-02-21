/// <reference types="cypress"/>
import '../../support/commands';

beforeEach(() => {
  cy.login();
  cy.visitDataExploration('biospecimens', '?sharedFilterId=4fec6182-edd8-4937-8a80-6f790d7df665');
  cy.get('[data-cy="SidebarMenuItem_Biospecimen"]').clickAndWait({force: true});
  cy.get('[class*="Filters_filterExpandBtnWrapper"] button[class*="ant-btn-link"]').clickAndWait({force: true}); //data-cy="ExpandAll"
  cy.get('[class*="Filters_filterExpandBtnWrapper"] button[class*="ant-btn-link"]').contains('Collapse all').should('exist'); //data-cy="ExpandAll"
});

describe('Page Data Exploration (Biospecimen) - Filtrer avec les facettes', () => {
  it('Expand all/Collapse all', () => {
    cy.get('[class*="Filters_filterExpandBtnWrapper"] button[class*="ant-btn-link"]').contains('Collapse all').should('exist'); //data-cy="ExpandAll"
    cy.get('section[class*="Filters"] [aria-expanded="true"]').should('exist');
    cy.get('section[class*="Filters"] [aria-expanded="false"]').should('not.exist');

    cy.get('[class*="Filters_filterExpandBtnWrapper"] button[class*="ant-btn-link"]').clickAndWait({force: true}); //data-cy="ExpandAll"
    cy.get('[class*="Filters_filterExpandBtnWrapper"] button[class*="ant-btn-link"]').contains('Expand all').should('exist'); //data-cy="ExpandAll"
    cy.get('section[class*="Filters"] [aria-expanded="false"]').should('exist');
    cy.get('section[class*="Filters"] [aria-expanded="true"]').should('not.exist');
  });

  it('Search by sample ID - BS_KB0GZCP5', () => {
    cy.get('[class*="SearchLabel_title"]').contains('Search by Sample ID').should('exist'); //data-cy="SearchLabel_Title"

    cy.get('[class*="SearchLabel_tooltipIcon"]').eq(0).trigger('mouseover', {eventConstructor: 'MouseEvent', force: true}); //data-cy="SearchLabel_InfoCircleOutlined"
    cy.get('div[class="ant-tooltip-inner"]').contains('Search by Sample ID or External Sample ID').should('exist');

    cy.typeAndIntercept('[class*="ant-select-show-search"]', 'bs_kb0gzcp5', 'POST', '*/grapgql', 3); //data-cy="SearchAutocomplete_Select"
    cy.get('[class*="ant-select-dropdown"] [class*="ant-select-item"]').contains('BS_KB0GZCP5').should('exist'); //data-cy="Search_Dropdown"
    cy.get('[class*="ant-select-dropdown"] [class*="ant-select-item"]').eq(0).click({force: true}); //data-cy="Search_Dropdown"

    cy.get('[class*="ant-select-show-search"] [class*="ant-tag"]').contains('BS_KB0GZCP5').should('exist'); //data-cy="Tag_BS_KB0GZCP5"
    cy.get('[class*="QueryBar_selected"] [class*="QueryPill_field"]').contains('Sample ID').should('exist');
    cy.get('[class*="QueryBar_selected"] [class*="QueryValues_value"]').contains('BS KB0GZCP5').should('exist');
    cy.validateTableResultsCount(/^1 Result$/);

    cy.get('[data-icon="close-circle"]').clickAndWait({force: true});
    cy.get('[class*="ant-select-show-search"] [class*="ant-tag"]').should('not.exist'); //data-cy="Tag_BS_KB0GZCP5"
  });

  it('Search by external sample ID - 01-0665', () => {
    cy.typeAndIntercept('[class*="ant-select-show-search"]', '01-0665', 'POST', '*/grapgql', 3); //data-cy="SearchAutocomplete_Select"
    cy.get('[class*="ant-select-dropdown"] [class*="ant-select-item"]').contains('BS_KB0GZCP5').should('exist'); //data-cy="Search_Dropdown"
    cy.get('[class*="ant-select-dropdown"] [class*="ant-select-item"]').eq(0).click({force: true}); //data-cy="Search_Dropdown"

    cy.get('[class*="ant-select-show-search"] [class*="ant-tag"]').contains('BS_KB0GZCP5').should('exist'); //data-cy="Tag_BS_KB0GZCP5"
    cy.get('[class*="QueryBar_selected"] [class*="QueryPill_field"]').contains('Sample ID').should('exist');
    cy.get('[class*="QueryBar_selected"] [class*="QueryValues_value"]').contains('BS KB0GZCP5').should('exist');
    cy.validateTableResultsCount(/^1 Result$/);

    cy.get('[data-icon="close-circle"]').clickAndWait({force: true});
    cy.get('[class*="ant-select-show-search"] [class*="ant-tag"]').should('not.exist'); //data-cy="Tag_BS_KB0GZCP5"
  });

  it('Search by collection ID - SA_G25NX8A9', () => {
    cy.get('[class*="SearchLabel_title"]').contains('Search by Collection ID').should('exist');

    cy.typeAndIntercept('[class*="ant-select-show-search"]', 'SA_G25NX8A9', 'POST', '*/grapgql', 3, 1);
    cy.get('[class*="ant-select-dropdown"] [class*="ant-select-item"]').contains('SA_G25NX8A9').should('exist');
    cy.get('[class*="ant-select-dropdown"] [class*="ant-select-item"]').contains('SA_G25NX8A9').clickAndWait({force: true});

    cy.get('[class*="ant-select-show-search"] [class*="ant-tag"]').contains('SA_G25NX8A9').should('exist');
    cy.get('[class*="QueryBar_selected"] [class*="QueryPill_field"]').contains('Collection ID').should('exist');
    cy.get('[class*="QueryBar_selected"] [class*="QueryValues_value"]').contains('SA G25NX8A9').should('exist');
    cy.validateTableResultsCount(/^1 Result$/);

    cy.get('[data-icon="close-circle"]').clickAndWait({force: true});
  });

  it('Sample Type - DNA', () => {
    cy.validateFacetFilter('Sample Type', 'DNA', 'DNA', /\d{1}/, 1);
    cy.validateFacetRank(0, 'Sample Type');
  });

  it('Collection Sample Type - Saliva', () => {
    cy.validateFacetFilter('Collection Sample Type', 'Saliva', 'Saliva', /\d{1}/, 1);
    cy.validateFacetRank(1, 'Collection Sample Type');
  });

  it('Age at Biospec. Collection (days) - 2000', () => {
    cy.validateFacetNumFilter('Max', 'Age at Biospec. Collection (days)', '2000', /\d{1}/, true, 1);
    cy.validateFacetRank(2, 'Age at Biospec. Collection (days)');
  });

  it('Age at Histological Diagnosis (days) - 1000', () => {
    cy.validateFacetNumFilter('Max', 'Age at Histological Diagnosis (days)', '1000', /\d{1}/, true, 1);
    cy.validateFacetRank(3, 'Age at Histological Diagnosis (days)');
  });

  it('Sample Availability - Unavailable', () => {
    cy.validateFacetFilter('Sample Availability', 'Unavailable', 'unavailable', /\d{1}/, 1);
    cy.validateFacetRank(4, 'Sample Availability');
  });

  it('Anatomical Site (NCIT)', () => {
    // Pas de données
    //cy.validateFacetFilter('Anatomical Site (NCIT)', '', '', /^$/, 1);
    cy.validateFacetRank(5, 'Anatomical Site (NCIT)');
  });

  it('Anatomical Site (Source Text) - Not Reported', () => {
    cy.validateFacetFilter('Anatomical Site (Source Text)', 'Not Reported', 'Not Reported', /\d{1}/, 1);
    cy.validateFacetRank(6, 'Anatomical Site (Source Text)');
  });

  it('Consent Type - GRU', () => {
    cy.validateFacetFilter('Consent Type', 'GRU', 'GRU', /\d{1}/, 1);
    cy.validateFacetRank(7, 'Consent Type');
  });

  it('dbGaP Consent Code - Phs001436.c1', () => {
    cy.validateFacetFilter('dbGaP Consent Code', 'Phs001436.c1', 'phs001436.c1', /\d{1}/, 1);
    cy.validateFacetRank(8, 'dbGaP Consent Code');
  });

  it('Histological Diagnosis (MONDO) - MONDO:0005072', () => {
    cy.validateFacetFilter('Histological Diagnosis (MONDO)', 'Neuroblastoma (MONDO:0005072)', 'neuroblastoma (MONDO:0005072)', /\d{1}/, 1);
    cy.validateFacetRank(9, 'Histological Diagnosis (MONDO)');
  });

  it('Histological Diagnosis (NCIT) - NCIT:C3270', () => {
    cy.validateFacetFilter('Histological Diagnosis (NCIT)', 'Neuroblastoma (NCIT:C3270)', 'Neuroblastoma (NCIT:C3270)', /\d{1}/, 1);
    cy.validateFacetRank(10, 'Histological Diagnosis (NCIT)');
  });

  it('Histological Diagnosis (Source Text) - Neuroblastoma', () => {
    cy.validateFacetFilter('Histological Diagnosis (Source Text)', 'Neuroblastoma', 'Neuroblastoma', /\d{1}/, 1);
    cy.validateFacetRank(11, 'Histological Diagnosis (Source Text)');
  });

  it('Tumor Location (Source Text) - Not Reported', () => {
    cy.validateFacetFilter('Tumor Location (Source Text)', 'Reported Unknown', 'Reported Unknown', /\d{1}/, 1);
    cy.validateFacetRank(12, 'Tumor Location (Source Text)');
  });

  it('Method of Sample Procurement - Not Reported', () => {
    cy.validateFacetFilter('Method of Sample Procurement', 'Not Reported', 'Not Reported', /\d{1}/, 1);
    cy.validateFacetRank(13, 'Method of Sample Procurement');
  });
  
  it('Preservation Method - Frozen at -80', () => {
    // Pas de données
    //cy.validateFacetFilter('Preservation Method', 'Frozen at -80', 'Frozen at -80', /\d{1}/, 1);
    cy.validateFacetRank(14, 'Preservation Method');
  });

  it('Tumor Status - Normal', () => {
    // Pas de données
    //cy.validateFacetFilter('Tumor Status', 'Normal', 'Normal', /\d{1}/, 1);
    cy.validateFacetRank(15, 'Tumor Status');
  });

  it('Paired Normal Sample - False', () => {
    cy.get('[aria-expanded="true"] [data-cy="FilterContainer_Paired Normal Sample"]').should('exist');
    cy.wait(1000);
    cy.clickAndIntercept('input[type="radio"][value="false"]', 'POST', '**/graphql', 12);
    cy.validatePillSelectedQuery('Paired Normal Sample', ['False'], 1);
    cy.validateTableResultsCount(/\d{1}/);
    cy.validateFacetRank(16, 'Paired Normal Sample');
  });

  it('Tumor Descriptor (Source Text) - Primary', () => {
    cy.validateFacetFilter('Tumor Descriptor (Source Text)', 'Primary', 'primary', /\d{1}/, 1);
    cy.validateFacetRank(17, 'Tumor Descriptor (Source Text)');
  });
});
