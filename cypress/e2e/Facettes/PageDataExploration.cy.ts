/// <reference types="cypress"/>
import '../../support/commands';

beforeEach(() => {
  cy.login();
});

describe('Page Data Exploration (Study) - Filtrer avec les facettes', () => {
  beforeEach(() => {
    cy.visitDataExploration('participants', '?sharedFilterId=4fec6182-edd8-4937-8a80-6f790d7df665');
    cy.get('[data-cy="SidebarMenuItem_Study"]').clickAndWait({force: true});
    cy.get('[class*="Filters_filterExpandBtnWrapper"] button[class*="ant-btn-link"]').clickAndWait({force: true}); //data-cy="ExpandAll"
    cy.get('[class*="Filters_filterExpandBtnWrapper"] button[class*="ant-btn-link"]').contains('Collapse all').should('exist'); //data-cy="ExpandAll"
  });

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

describe('Page Data Exploration (Participants) - Filtrer avec les facettes', () => {
  beforeEach(() => {
    cy.visitDataExploration('participants', '?sharedFilterId=4fec6182-edd8-4937-8a80-6f790d7df665');
    cy.get('[data-cy="SidebarMenuItem_Participant"]').clickAndWait({force: true});
    cy.get('[class*="Filters_filterExpandBtnWrapper"] button[class*="ant-btn-link"]').clickAndWait({force: true}); //data-cy="ExpandAll"
    cy.get('[class*="Filters_filterExpandBtnWrapper"] button[class*="ant-btn-link"]').contains('Collapse all').should('exist'); //data-cy="ExpandAll"
  });

  it('Expand all/Collapse all', () => {
    cy.get('[class*="Filters_filterExpandBtnWrapper"] button[class*="ant-btn-link"]').contains('Collapse all').should('exist'); //data-cy="ExpandAll"
    cy.get('section[class*="Filters"] [aria-expanded="true"]').should('exist');
    cy.get('section[class*="Filters"] [aria-expanded="false"]').should('not.exist');

    cy.get('[class*="Filters_filterExpandBtnWrapper"] button[class*="ant-btn-link"]').clickAndWait({force: true}); //data-cy="ExpandAll"
    cy.get('[class*="Filters_filterExpandBtnWrapper"] button[class*="ant-btn-link"]').contains('Expand all').should('exist'); //data-cy="ExpandAll"
    cy.get('section[class*="Filters"] [aria-expanded="false"]').should('exist');
    cy.get('section[class*="Filters"] [aria-expanded="true"]').should('not.exist');
  });

  it('Search by participant ID - PT_01236T3G', () => {
    cy.get('[class*="SearchLabel_title"]').contains('Search by Participant ID').should('exist'); //data-cy="SearchLabel_Title"

    cy.get('[class*="SearchLabel_tooltipIcon"]').trigger('mouseover', {eventConstructor: 'MouseEvent', force: true}); //data-cy="SearchLabel_InfoCircleOutlined"
    cy.get('div[class="ant-tooltip-inner"]').contains('Search by Participant ID, External Participant ID or Family ID').should('exist');

    cy.typeAndIntercept('[class*="ant-select-show-search"]', 'pt_01236t3g', 'POST', '*/grapgql', 3); //data-cy="SearchAutocomplete_Select"
    cy.get('[class*="ant-select-dropdown"] [class*="ant-select-item"]').contains('PT_01236T3G').should('exist'); //data-cy="Search_Dropdown"
    cy.get('[class*="ant-select-dropdown"] [class*="ant-select-item"]').eq(0).click({force: true}); //data-cy="Search_Dropdown"

    cy.get('[class*="ant-select-show-search"] [class="ant-tag"]').contains('PT_01236T3G').should('exist'); //data-cy="Tag_PT_01236T3G"
    cy.get('[class*="QueryBar_selected"] [class*="QueryPill_field"]').contains('Participant ID').should('exist');
    cy.get('[class*="QueryBar_selected"] [class*="QueryValues_value"]').contains('PT 01236T3G').should('exist');
    cy.validateTableResultsCount(/^1 Result$/);

    cy.get('[data-icon="close-circle"]').clickAndWait({force: true});
    cy.get('[class*="ant-select-show-search"] [class="ant-tag"]').should('not.exist'); //data-cy="Tag_PT_01236T3G"
  });

  it('Search by external participant ID - 01-0665', () => {
    cy.typeAndIntercept('[class*="ant-select-show-search"]', '01-0665', 'POST', '*/grapgql', 3); //data-cy="SearchAutocomplete_Select"
    cy.get('[class*="ant-select-dropdown"] [class*="ant-select-item"]').contains('PT_01236T3G').should('exist'); //data-cy="Search_Dropdown"
    cy.get('[class*="ant-select-dropdown"] [class*="ant-select-item"]').eq(0).click({force: true}); //data-cy="Search_Dropdown"

    cy.get('[class*="ant-select-show-search"] [class="ant-tag"]').contains('PT_01236T3G').should('exist'); //data-cy="Tag_PT_01236T3G"
    cy.get('[class*="QueryBar_selected"] [class*="QueryPill_field"]').contains('Participant ID').should('exist');
    cy.get('[class*="QueryBar_selected"] [class*="QueryValues_value"]').contains('PT 01236T3G').should('exist');
    cy.validateTableResultsCount(/^1 Result$/);

    cy.get('[data-icon="close-circle"]').clickAndWait({force: true});
    cy.get('[class*="ant-select-show-search"] [class="ant-tag"]').should('not.exist'); //data-cy="Tag_PT_01236T3G"
  });

  it('Search by family ID - FM_Z4Y7FP70', () => {
    cy.typeAndIntercept('[class*="ant-select-show-search"]', 'fm_z4y7fp70', 'POST', '*/grapgql', 3); //data-cy="SearchAutocomplete_Select"
    cy.get('[class*="ant-select-dropdown"] [class*="ant-select-item"]').contains(/(PT_01236T3G|PT_1DYA8779|PT_RZVC67GC)/).should('exist'); //data-cy="Search_Dropdown"
    cy.get('[class*="ant-select-dropdown"] [class*="ant-select-item"]').eq(0).click({force: true}); //data-cy="Search_Dropdown"

    cy.get('[class*="ant-select-show-search"] [class="ant-tag"]').contains(/(PT_01236T3G|PT_1DYA8779|PT_RZVC67GC)/).should('exist'); //data-cy="Tag_PT_01236T3G"
    cy.get('[class*="QueryBar_selected"] [class*="QueryPill_field"]').contains('Participant ID').should('exist');
    cy.get('[class*="QueryBar_selected"] [class*="QueryValues_value"]').contains(/(PT 01236T3G|PT 1DYA8779|PT RZVC67GC)/).should('exist');
    cy.validateTableResultsCount(/^1 Result$/);

    cy.get('[data-icon="close-circle"]').clickAndWait({force: true});
    cy.get('[class*="ant-select-show-search"] [class="ant-tag"]').should('not.exist'); //data-cy="Tag_PT_01236T3G"
  });

  it('Proband - True', () => {
    cy.get('[aria-expanded="true"] [data-cy="FilterContainer_Proband"]').should('exist');
    cy.wait(1000);
    cy.clickAndIntercept('input[type="radio"][value="true"]', 'POST', '**/graphql', 12);
    cy.validatePillSelectedQuery('Proband', ['True'], 1);
    cy.validateTableResultsCount(/\d{1}/);
    cy.validateFacetRank(0, 'Proband');
  });

  it('Ethnicity - Not Hispanic or Latino', () => {
    cy.validateFacetFilter('Ethnicity', 'Not Hispanic or Latino', 'Not Hispanic or Latino', /\d{1}/, 1);
    cy.validateFacetRank(1, 'Ethnicity');
  });

  it('Sex - Female', () => {
    cy.validateFacetFilter('Sex', 'Female', 'female', /\d{1}/, 1);
    cy.validateFacetRank(2, 'Sex');
  });

  it('Race - White', () => {
    cy.validateFacetFilter('Race', 'White', 'White', /\d{1}/, 1);
    cy.validateFacetRank(3, 'Race');
  });
});

describe('Page Data Exploration (Clinical) - Filtrer avec les facettes', () => {
  beforeEach(() => {
    cy.visitDataExploration('participants', '?sharedFilterId=4fec6182-edd8-4937-8a80-6f790d7df665');
    cy.get('[data-cy="SidebarMenuItem_Clinical"]').clickAndWait({force: true});
    cy.get('[class*="Filters_filterExpandBtnWrapper"] button[class*="ant-btn-link"]').clickAndWait({force: true}); //data-cy="ExpandAll"
    cy.get('[class*="Filters_filterExpandBtnWrapper"] button[class*="ant-btn-link"]').contains('Collapse all').should('exist'); //data-cy="ExpandAll"
  });

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
    cy.validateFacetNumFilter('Age at Diagnosis (days)', '1000', /\d{1}/, true, 1);
    cy.validateFacetRank(0, 'Age at Diagnosis (days)');
  });

  it('Age at Vital Status (days) - 1000', () => {
    cy.validateFacetNumFilter('Age at Vital Status (days)', '1000', /\d{1}/, true, 1);
    cy.validateFacetRank(1, 'Age at Vital Status (days)');
  });

  it('Age at Observed Phenotype (days) - 1000', () => {
    cy.validateFacetNumFilter('Age at Observed Phenotype (days)', '1000', /\d{1}/, true, 1);
    cy.validateFacetRank(2, 'Age at Observed Phenotype (days)');
  });

  it('Diagnosis (MONDO)', () => {
    cy.get('div[class*="CollapsePlaceHolderFacet_collapseLikeFacet"]').eq(0).contains('Diagnosis (MONDO)').should('exist');
    // TODO Filtrer
  });

  it('Diagnosis (NCIT) - NCIT:C3270', () => {
    cy.validateFacetFilter('Diagnosis (NCIT)', 'Neuroblastoma (NCIT:C3270)', 'Neuroblastoma (NCIT:C3270)', /^492$/, 1);
    cy.validateFacetRank(3, 'Diagnosis (NCIT)');
  });

  it('Diagnosis (Source Text) - Atrial septal defect', () => {
    cy.validateFacetFilter('Diagnosis (Source Text)', 'Atrial septal defect', 'Atrial septal defect', /\d{1}/, 1);
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

  it('Not Observed Phenotype (HPO) - Cleft palate (HP:0000175)', () => {
    cy.validateFacetFilter('Not Observed Phenotype (HPO)', 'Cleft palate (HP:0000175)', 'Cleft palate (HP:0000175)', /^1,491$/, 1);
    cy.validateFacetRank(6, 'Not Observed Phenotype (HPO)');
  });

  it('Observed Phenotype (Source Text) - Heterotaxy', () => {
    cy.validateFacetFilter('Observed Phenotype (Source Text)', 'Heterotaxy', 'Heterotaxy', /\d{1}/, 1);
    cy.validateFacetRank(7, 'Observed Phenotype (Source Text)');
  });

  it('Vital Status - Alive', () => {
    cy.validateFacetFilter('Vital Status', 'Alive', 'Alive', /\d{1}/, 1);
    cy.validateFacetRank(8, 'Vital Status');
  });
});

describe('Page Data Exploration (Biospecimen) - Filtrer avec les facettes', () => {
  beforeEach(() => {
    cy.visitDataExploration('biospecimens', '?sharedFilterId=4fec6182-edd8-4937-8a80-6f790d7df665');
    cy.get('[data-cy="SidebarMenuItem_Biospecimen"]').clickAndWait({force: true});
    cy.get('[class*="Filters_filterExpandBtnWrapper"] button[class*="ant-btn-link"]').clickAndWait({force: true}); //data-cy="ExpandAll"
    cy.get('[class*="Filters_filterExpandBtnWrapper"] button[class*="ant-btn-link"]').contains('Collapse all').should('exist'); //data-cy="ExpandAll"
  });

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

  // TODO - Ne fonctionne pas
  it.skip('Search by collection ID - SA_G25NX8A9', () => {
    cy.get('[class*="SearchLabel_title"]').contains('Search by Collection ID').should('exist'); //data-cy="SearchLabel_Title"

    cy.typeAndIntercept('[class*="ant-select-show-search"]', 'SA_G25NX8A9', 'POST', '*/grapgql', 3, 1); //data-cy="SearchAutocomplete_Select"
    cy.get('[class*="ant-select-dropdown"] [class*="ant-select-item"]').contains('SA_G25NX8A9').should('exist'); //data-cy="Search_Dropdown"
    cy.get('[class*="ant-select-dropdown"] [class*="ant-select-item"]').contains('SA_G25NX8A9').clickAndWait({force: true}); //data-cy="Search_Dropdown"

    cy.get('[class*="ant-select-show-search"] [class*="ant-tag"]').contains('SA_G25NX8A9').should('exist'); //data-cy="Tag_BS_KB0GZCP5"
    cy.get('[class*="QueryBar_selected"] [class*="QueryPill_field"]').contains('Collection ID').should('exist');
    cy.get('[class*="QueryBar_selected"] [class*="QueryValues_value"]').contains('SA G25NX8A9').should('exist');
    cy.validateTableResultsCount(/^1 Result$/);

    cy.get('[data-icon="close-circle"]').clickAndWait({force: true});
    cy.get('[class*="ant-select-show-search"] [class*="ant-tag"]').contains('SA_G25NX8A9').should('not.exist'); //data-cy="Tag_BS_KB0GZCP5"
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
    cy.validateFacetNumFilter('Age at Biospec. Collection (days)', '2000', /\d{1}/, true, 1);
    cy.validateFacetRank(2, 'Age at Biospec. Collection (days)');
  });

  it('Age at Histological Diagnosis (days) - 1000', () => {
    cy.validateFacetNumFilter('Age at Histological Diagnosis (days)', '1000', /\d{1}/, true, 1);
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

describe('Page Data Exploration (Data Files) - Filtrer avec les facettes', () => {
  beforeEach(() => {
    cy.visitDataExploration('datafiles', '?sharedFilterId=4fec6182-edd8-4937-8a80-6f790d7df665');
    cy.get('[data-cy="SidebarMenuItem_Data File"]').clickAndWait({force: true});
    cy.get('[class*="Filters_filterExpandBtnWrapper"] button[class*="ant-btn-link"]').clickAndWait({force: true}); //data-cy="ExpandAll"
    cy.get('[class*="Filters_filterExpandBtnWrapper"] button[class*="ant-btn-link"]').contains('Collapse all').should('exist'); //data-cy="ExpandAll"
  });

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

  it('File Format - gVCF [SKFP-722]', () => {
    cy.validateFacetFilter('File Format', 'GVCF', 'gvcf', /^3,235$/, 1);
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

  it('Repository - Gen3', () => {
    cy.validateFacetFilter('Repository', 'Gen3', 'gen3', /\d{1}/, 1);
    cy.validateFacetRank(9, 'Repository');
  });

  it('ACL - Phs002330.c1', () => {
    cy.validateFacetFilter('ACL', 'Phs002330.c1', 'phs002330.c1', /\d{1}/, 1);
    cy.validateFacetRank(10, 'ACL');
  });
});

describe('Page Data Exploration (Data Files) - Filtrer avec les facettes', () => {
  beforeEach(() => {
    cy.visitDataExploration('datafiles');
    cy.get('[data-cy="SidebarMenuItem_Data File"]').clickAndWait({force: true});
    cy.get('[class*="Filters_filterExpandBtnWrapper"] button[class*="ant-btn-link"]').clickAndWait({force: true}); //data-cy="ExpandAll"
    cy.get('[class*="Filters_filterExpandBtnWrapper"] button[class*="ant-btn-link"]').contains('Collapse all').should('exist'); //data-cy="ExpandAll"
  });

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

  it('Body Part Examined - BRAIN', () => {
    cy.validateFacetFilter('Body Part Examined', 'BRAIN', 'BRAIN', /\d{1}/);
    cy.validateFacetRank(14, 'Body Part Examined');
  });

  it('Magnetic Field Strength - Illumina', () => {
    cy.validateFacetNumFilter('Magnetic Field Strength', '2', /\d{1}/, true);
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
