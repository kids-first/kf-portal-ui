/// <reference types="Cypress" />
import '../../support/commands';

beforeEach(() => {
  cy.login();
});

describe('Page Data Exploration (Study) - Filtrer avec les facettes', () => {
  beforeEach(() => {
    cy.visitDataExploration('participants', '?sharedFilterId=4fec6182-edd8-4937-8a80-6f790d7df665');
    cy.get('[data-cy="SidebarMenuItem_Study"]').click({force: true});
    cy.get('[class*="Filters_filterExpandBtnWrapper"] button[class*="ant-btn-link"]').click({force: true}); //data-cy="ExpandAll"
    cy.get('[class*="Filters_filterExpandBtnWrapper"] button[class*="ant-btn-link"]').contains('Collapse all').should('exist'); //data-cy="ExpandAll"
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

  it('Study Name - Kids First: Genomic Analysis of Congenital Diaphragmatic Hernia', () => {
    cy.validateFacetFilter('Study Name', 'Kids First: Genomic Analysis of Congenital Diaphragmatic Hernia', 'Kids First: Genomic Analysis of Congenital Diaphragmatic Hernia', /^2,031$/, 1);
    cy.validateFacetRank(0, 'Study Name');
  });

  it('Study Code - KF-CDH', () => {
    cy.get('[id="query-builder-header-tools"]').find('[data-icon="plus"]').click({force: true});
    cy.waitWhileSpin(2000);
    cy.validateFacetFilter('Study Code', 'KF-CDH', 'KF-CDH', /^2,031$/, 0);
    cy.validateFacetRank(1, 'Study Code');
  });

  it('Study Program - Kids First', () => {
    cy.validateFacetFilter('Study Program', 'Kids First', 'Kids First', /^16,405$/, 1);
    cy.validateFacetRank(2, 'Study Program');
  });

  it('Study Domain - Birth Defect', () => {
    cy.validateFacetFilter('Study Domain', 'Birth Defect', 'BIRTHDEFECT', /^9,776$/, 1);
    cy.validateFacetRank(3, 'Study Domain');
  });

  it('dbGaP Accession Number - Phs001110', () => {
    cy.validateFacetFilter('dbGaP Accession Number', 'Phs001110', 'phs001110', /^2,031$/, 1);
    cy.validateFacetRank(4, 'dbGaP Accession Number');
  });
});

describe('Page Data Exploration (Participants) - Filtrer avec les facettes', () => {
  beforeEach(() => {
    cy.visitDataExploration('participants', '?sharedFilterId=4fec6182-edd8-4937-8a80-6f790d7df665');
    cy.get('[data-cy="SidebarMenuItem_Participant"]').click({force: true});
    cy.get('[class*="Filters_filterExpandBtnWrapper"] button[class*="ant-btn-link"]').click({force: true}); //data-cy="ExpandAll"
    cy.get('[class*="Filters_filterExpandBtnWrapper"] button[class*="ant-btn-link"]').contains('Collapse all').should('exist'); //data-cy="ExpandAll"
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

  it('Search by participant ID - PT_M8MDJNZB', () => {
    cy.get('[class*="SearchLabel_title"]').contains('Search by Participant ID').should('exist'); //data-cy="SearchLabel_Title"

    cy.get('[class*="SearchLabel_tooltipIcon"]').trigger('mouseover', {eventConstructor: 'MouseEvent', force: true}); //data-cy="SearchLabel_InfoCircleOutlined"
    cy.get('div[class="ant-tooltip-inner"]').contains('Search by Participant ID, External Participant ID or Family ID').should('exist');

    cy.typeAndIntercept('[class*="ant-select-show-search"]', 'PT_M8MDJNZB', 'POST', '*/grapgql', 3); //data-cy="SearchAutocomplete_Select"
    cy.wait(1000);
    cy.get('[class*="ant-select-dropdown"]').contains('PT_M8MDJNZB').should('exist'); //data-cy="Search_Dropdown"
    cy.get('[class*="ant-select-dropdown"]').find('div[class*="ant-select-item"]').eq(0).click({force: true}); //data-cy="Search_Dropdown"

    cy.get('[class*="ant-select-show-search"] [class="ant-tag"]').contains('PT_M8MDJNZB').should('exist'); //data-cy="Tag_PT_M8MDJNZB"
    cy.get('[class*="QueryBar_selected"]').find('[class*="QueryPill_field"]').contains('Participant ID').should('exist');
    cy.get('[class*="QueryBar_selected"]').find('[class*="QueryValues_value"]').contains('PT M8MDJNZB').should('exist');
    cy.validateTableResultsCount(/^1 Results$/);

    cy.get('[data-icon="close-circle"]').click({force: true});
    cy.get('[class*="ant-select-show-search"] [class="ant-tag"]').should('not.exist'); //data-cy="Tag_PT_M8MDJNZB"
  });

  it('Proband - True', () => {
    cy.get('[aria-expanded="true"] [data-cy="FilterContainer_Proband"]').should('exist');
    cy.wait(1000);
    cy.clickAndIntercept('input[type="radio"][value="true"]', 'POST', '**/graphql', 12);
    cy.validatePillSelectedQuery('Proband', ['True'], 1);
    cy.validateTableResultsCount(/^7,373$/);
    cy.validateFacetRank(0, 'Proband');
  });

  it('Ethnicity - Not Hispanic or Latino', () => {
    cy.validateFacetFilter('Ethnicity', 'Not Hispanic or Latino', 'Not Hispanic or Latino', /^10,951$/, 1);
    cy.validateFacetRank(1, 'Ethnicity');
  });

  it('Sex - Female', () => {
    cy.validateFacetFilter('Sex', 'Female', 'female', /^7,882$/, 1);
    cy.validateFacetRank(2, 'Sex');
  });

  it('Race - White', () => {
    cy.validateFacetFilter('Race', 'White', 'White', /^10,507$/, 1);
    cy.validateFacetRank(3, 'Race');
  });
});

describe('Page Data Exploration (Clinical) - Filtrer avec les facettes', () => {
  beforeEach(() => {
    cy.visitDataExploration('participants', '?sharedFilterId=4fec6182-edd8-4937-8a80-6f790d7df665');
    cy.get('[data-cy="SidebarMenuItem_Clinical"]').click({force: true});
    cy.get('[class*="Filters_filterExpandBtnWrapper"] button[class*="ant-btn-link"]').click({force: true}); //data-cy="ExpandAll"
    cy.get('[class*="Filters_filterExpandBtnWrapper"] button[class*="ant-btn-link"]').contains('Collapse all').should('exist'); //data-cy="ExpandAll"
  });

  it('Expand all/Collapse all', () => {
    cy.get('[class*="Filters_filterExpandBtnWrapper"] button[class*="ant-btn-link"]').contains('Collapse all').should('exist'); //data-cy="ExpandAll"
    cy.get('section[class*="Filters"] [aria-expanded="true"]').should('exist');
    cy.get('section[class*="Filters"] [aria-expanded="false"]').its('length').should('eq', 2);

    cy.get('[class*="Filters_filterExpandBtnWrapper"] button[class*="ant-btn-link"]').click({force: true}); //data-cy="ExpandAll"
    cy.get('[class*="Filters_filterExpandBtnWrapper"] button[class*="ant-btn-link"]').contains('Expand all').should('exist'); //data-cy="ExpandAll"
    cy.get('section[class*="Filters"] [aria-expanded="false"]').should('exist');
    cy.get('section[class*="Filters"] [aria-expanded="true"]').should('not.exist');
  });

  it('Age at Diagnosis (days) - 1000', () => {
    cy.validateFacetNumFilter('Age at Diagnosis (days)', '1000', /^5,229$/, true, 1);
    cy.validateFacetRank(0, 'Age at Diagnosis (days)');
  });

  it('Age at Vital Status (days) - 1000', () => {
    cy.validateFacetNumFilter('Age at Vital Status (days)', '1000', /^1,887$/, true, 1);
    cy.validateFacetRank(1, 'Age at Vital Status (days)');
  });

  it('Age at Observed Phenotype (days) - 1000', () => {
    cy.validateFacetNumFilter('Age at Observed Phenotype (days)', '1000', /^5,191$/, true, 1);
    cy.validateFacetRank(2, 'Age at Observed Phenotype (days)');
  });

  it('Diagnosis (MONDO)', () => {
    cy.get('div[class*="CollapsePlaceHolderFacet_collapseLikeFacet"]').eq(0).contains('Diagnosis (MONDO)').should('exist');
    // TODO Filtrer
  });

  it('Diagnosis (NCIT) - NCIT:C3270', () => {
    cy.validateFacetFilter('Diagnosis (NCIT)', 'NCIT:C3270', 'NCIT:C3270', /^512$/, 1);
    cy.validateFacetRank(3, 'Diagnosis (NCIT)');
  });

  it('Diagnosis (Source Text) - Atrial septal defect', () => {
    cy.validateFacetFilter('Diagnosis (Source Text)', 'Atrial septal defect', 'Atrial septal defect', /^1,062$/, 1);
    cy.validateFacetRank(4, 'Diagnosis (Source Text)');
  });

  it('Family Composition - Proband-only', () => {
    cy.validateFacetFilter('Family Composition', 'Proband-only', 'proband-only', /^3,400$/, 1);
    cy.validateFacetRank(5, 'Family Composition');
  });

  it('Observed Phenotype (HPO)', () => {
    cy.get('div[class*="CollapsePlaceHolderFacet_collapseLikeFacet"]').eq(1).contains('Observed Phenotype (HPO)').should('exist');
    // TODO Filtrer
  });

  it('Not Observed Phenotype (HPO) - Cleft palate (HP:0000175)', () => {
    cy.validateFacetFilter('Not Observed Phenotype (HPO)', 'Cleft palate (HP:0000175)', 'Cleft palate (HP:0000175)', /^1,602$/, 1);
    cy.validateFacetRank(6, 'Not Observed Phenotype (HPO)');
  });

  it('Observed Phenotype (Source Text) - Heterotaxy', () => {
    cy.validateFacetFilter('Observed Phenotype (Source Text)', 'Heterotaxy', 'Heterotaxy', /^1,104$/, 1);
    cy.validateFacetRank(7, 'Observed Phenotype (Source Text)');
  });

  it('Vital Status - Alive', () => {
    cy.validateFacetFilter('Vital Status', 'Alive', 'Alive', /^2,917$/, 1);
    cy.validateFacetRank(8, 'Vital Status');
  });
});

describe('Page Data Exploration (Biospecimen) - Filtrer avec les facettes', () => {
  beforeEach(() => {
    cy.visitDataExploration('biospecimens', '?sharedFilterId=4fec6182-edd8-4937-8a80-6f790d7df665');
    cy.get('[data-cy="SidebarMenuItem_Biospecimen"]').click({force: true});
    cy.get('[class*="Filters_filterExpandBtnWrapper"] button[class*="ant-btn-link"]').click({force: true}); //data-cy="ExpandAll"
    cy.get('[class*="Filters_filterExpandBtnWrapper"] button[class*="ant-btn-link"]').contains('Collapse all').should('exist'); //data-cy="ExpandAll"
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

  it('Search by sample ID - BS_0ZQ4019R', () => {
    cy.get('[class*="SearchLabel_title"]').contains('Search by Sample ID').should('exist'); //data-cy="SearchLabel_Title"

    cy.get('[class*="SearchLabel_tooltipIcon"]').trigger('mouseover', {eventConstructor: 'MouseEvent', force: true}); //data-cy="SearchLabel_InfoCircleOutlined"
    cy.get('div[class="ant-tooltip-inner"]').contains('Search by Sample ID or External Sample ID').should('exist');

    cy.intercept('POST', '*/grapgql').as('getRouteMatcher');
    cy.get('[class*="ant-select-show-search"]').eq(0).find('input').type('BS_0ZQ4019R', {force: true}); //data-cy="SearchAutocomplete_Select"
    cy.wait('@getRouteMatcher', {timeout: 60*1000});
    cy.wait('@getRouteMatcher', {timeout: 60*1000});
    cy.wait('@getRouteMatcher', {timeout: 60*1000});
    cy.wait(1000);
    cy.get('[class*="ant-select-dropdown"]').contains('BS_0ZQ4019R').should('exist'); //data-cy="Search_Dropdown"
    cy.get('[class*="ant-select-dropdown"]').find('div[class*="ant-select-item"]').eq(0).click({force: true}); //data-cy="Search_Dropdown"

    cy.get('[class*="ant-select-show-search"] [class*="ant-tag"]').contains('BS_0ZQ4019R').should('exist'); //data-cy="Tag_BS_0ZQ4019R"
    cy.get('[class*="QueryBar_selected"]').find('[class*="QueryPill_field"]').contains('Sample ID').should('exist');
    cy.get('[class*="QueryBar_selected"]').find('[class*="QueryValues_value"]').contains('BS 0ZQ4019R').should('exist');
    cy.validateTableResultsCount(/^1 Results$/);

    cy.get('[data-icon="close-circle"]').click({force: true});
    cy.get('[class*="ant-select-show-search"] [class*="ant-tag"]').should('not.exist'); //data-cy="Tag_BS_0ZQ4019R"
  });

  it('Search by collection ID - BS_0ZQ4019R_Peripheral_Whole_Blood', () => {
    cy.get('[class*="SearchLabel_title"]').contains('Search by Collection ID').should('exist'); //data-cy="SearchLabel_Title"

    cy.intercept('POST', '*/grapgql').as('getRouteMatcher');
    cy.get('[class*="ant-select-show-search"]').eq(1).find('input').type('BS_0ZQ4019R_Peripheral_Whole_Blood', {force: true}); //data-cy="SearchAutocomplete_Select"
    cy.wait('@getRouteMatcher', {timeout: 60*1000});
    cy.wait('@getRouteMatcher', {timeout: 60*1000});
    cy.wait('@getRouteMatcher', {timeout: 60*1000});
    cy.wait(1000);
    cy.get('[class*="ant-select-dropdown"]').contains('BS_0ZQ4019R_Peripheral_Whole_Blood').should('exist'); //data-cy="Search_Dropdown"
    cy.get('[class*="ant-select-dropdown"]').find('div[class*="ant-select-item"]').eq(0).click({force: true}); //data-cy="Search_Dropdown"

    cy.get('[class*="ant-select-show-search"]').eq(1).contains('+ 1 ...').should('exist'); //data-cy="Tag_+ 1 ..."
    cy.get('[class*="QueryBar_selected"]').find('[class*="QueryPill_field"]').contains('Collection ID').should('exist');
    cy.get('[class*="QueryBar_selected"]').find('[class*="QueryValues_value"]').contains('BS 0ZQ4019R Peripheral Whole Blood').should('exist');
    cy.validateTableResultsCount(/^1 Results$/);

    cy.get('[data-icon="close-circle"]').click({force: true});
    cy.get('[class*="ant-select-show-search"]').eq(1).contains('+ 1 ...').should('not.exist'); //data-cy="Tag_+ 1 ..."
  });

  it('Sample Type - DNA', () => {
    cy.validateFacetFilter('Sample Type', 'DNA', 'DNA', /^16,630$/, 1);
    cy.validateFacetRank(0, 'Sample Type');
  });

  it('Collection Sample Type - Saliva', () => {
    cy.validateFacetFilter('Collection Sample Type', 'Saliva', 'Saliva', /^926$/, 1);
    cy.validateFacetRank(1, 'Collection Sample Type');
  });

  it('Age at Biospec. Collection (days) - 2000', () => {
    cy.validateFacetNumFilter('Age at Biospec. Collection (days)', '2000', /^17,090$/, true, 1);
    cy.validateFacetRank(2, 'Age at Biospec. Collection (days)');
  });

  it('Age at Histological Diagnosis (days) - 1000', () => {
    cy.validateFacetNumFilter('Age at Histological Diagnosis (days)', '1000', /^1,478$/, true, 1);
    cy.validateFacetRank(3, 'Age at Histological Diagnosis (days)');
  });

  it('Sample Availability - Unavailable', () => {
    cy.validateFacetFilter('Sample Availability', 'Unavailable', 'unavailable', /^17,379$/, 1);
    cy.validateFacetRank(4, 'Sample Availability');
  });

  it('Anatomical Site (NCIT)', () => {
    // Pas de données
    //cy.validateFacetFilter('Anatomical Site (NCIT)', '', '', /^$/, 1);
    cy.validateFacetRank(5, 'Anatomical Site (NCIT)');
  });

  it('Anatomical Site (Source Text) - Not Reported', () => {
    cy.validateFacetFilter('Anatomical Site (Source Text)', 'Not Reported', 'Not Reported', /^7,924$/, 1);
    cy.validateFacetRank(6, 'Anatomical Site (Source Text)');
  });

  it('Consent Type - GRU', () => {
    cy.validateFacetFilter('Consent Type', 'GRU', 'GRU', /^10,914$/, 1);
    cy.validateFacetRank(7, 'Consent Type');
  });

  it('dbGaP Consent Code - Phs001138.c1', () => {
    cy.validateFacetFilter('dbGaP Consent Code', 'Phs001138.c1', 'phs001138.c1', /^2,981$/, 1);
    cy.validateFacetRank(8, 'dbGaP Consent Code');
  });

  it('Histological Diagnosis (MONDO) - MONDO:0005072', () => {
    cy.validateFacetFilter('Histological Diagnosis (MONDO)', 'MONDO:0005072', 'MONDO:0005072', /^947$/, 1);
    cy.validateFacetRank(9, 'Histological Diagnosis (MONDO)');
  });

  it('Histological Diagnosis (NCIT) - NCIT:C3270', () => {
    cy.validateFacetFilter('Histological Diagnosis (NCIT)', 'NCIT:C3270', 'NCIT:C3270', /^947$/, 1);
    cy.validateFacetRank(10, 'Histological Diagnosis (NCIT)');
  });

  it('Histological Diagnosis (Source Text) - Neuroblastoma', () => {
    cy.validateFacetFilter('Histological Diagnosis (Source Text)', 'Neuroblastoma', 'Neuroblastoma', /^946$/, 1);
    cy.validateFacetRank(11, 'Histological Diagnosis (Source Text)');
  });

  it('Tumor Location (Source Text) - Not Reported', () => {
    cy.validateFacetFilter('Tumor Location (Source Text)', 'Not Reported', 'Not Reported', /^1,794$/, 1);
    cy.validateFacetRank(12, 'Tumor Location (Source Text)');
  });

  it('Method of Sample Procurement - Blood Draw', () => {
    cy.validateFacetFilter('Method of Sample Procurement', 'Blood Draw', 'Blood Draw', /^2,913$/, 1);
    cy.validateFacetRank(13, 'Method of Sample Procurement');
  });

  it('Tumor Descriptor (Source Text) - Primary', () => {
    cy.validateFacetFilter('Tumor Descriptor (Source Text)', 'Primary', 'primary', /^110$/, 1);
    cy.validateFacetRank(14, 'Tumor Descriptor (Source Text)');
  });
});

describe('Page Data Exploration (Data Files) - Filtrer avec les facettes', () => {
  beforeEach(() => {
    cy.visitDataExploration('datafiles', '?sharedFilterId=4fec6182-edd8-4937-8a80-6f790d7df665');
    cy.get('[data-cy="SidebarMenuItem_Data File"]').click({force: true});
    cy.get('[class*="Filters_filterExpandBtnWrapper"] button[class*="ant-btn-link"]').click({force: true}); //data-cy="ExpandAll"
    cy.get('[class*="Filters_filterExpandBtnWrapper"] button[class*="ant-btn-link"]').contains('Collapse all').should('exist'); //data-cy="ExpandAll"
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

  it('Search by file ID - GF_96A7XYMK', () => {
    cy.get('[class*="SearchLabel_title"]').contains('Search by File ID').should('exist'); //data-cy="SearchLabel_Title"

    cy.typeAndIntercept('[class*="ant-select-show-search"]', 'GF_96A7XYMK', 'POST', '*/grapgql', 3); //data-cy="SearchAutocomplete_Select"
    cy.wait(1000);
    cy.get('[class*="ant-select-dropdown"]').contains('GF_96A7XYMK').should('exist'); //data-cy="Search_Dropdown"
    cy.get('[class*="ant-select-dropdown"]').find('div[class*="ant-select-item"]').eq(0).click({force: true}); //data-cy="Search_Dropdown"

    cy.get('[class*="ant-select-show-search"] [class="ant-tag"]').contains('GF_96A7XYMK').should('exist'); //data-cy="Tag_GF_96A7XYMK"
    cy.get('[class*="QueryBar_selected"]').find('[class*="QueryPill_field"]').contains('File ID').should('exist');
    cy.get('[class*="QueryBar_selected"]').find('[class*="QueryValues_value"]').contains('GF 96A7XYMK').should('exist');
    cy.validateTableResultsCount(/^1 Results$/);

    cy.get('[data-icon="close-circle"]').click({force: true});
    cy.get('[class*="ant-select-show-search"] [class="ant-tag"]').should('not.exist'); //data-cy="Tag_GF_96A7XYMK"
  });

  it('Access - Controlled', () => {
    cy.validateFacetFilter('Access', 'Controlled', 'Controlled', /^67,845$/, 1);
    cy.validateFacetRank(0, 'Access');
  });

  it('Data Category - Genomics', () => {
    cy.validateFacetFilter('Data Category', 'Genomics', 'Genomics', /^74,040$/, 1);
    cy.validateFacetRank(1, 'Data Category');
  });

  it('Data Type - GVCF', () => {
    cy.validateFacetFilter('Data Type', 'GVCF', 'gVCF', /^18,938$/, 1);
    cy.validateFacetRank(2, 'Data Type');
  });

  it('Experimental Strategy - Whole Genome Sequencing', () => {
    cy.validateFacetFilter('Experimental Strategy', 'Whole Genome Sequencing', 'Whole Genome Sequencing', /^2,252$/, 1);
    cy.validateFacetRank(3, 'Experimental Strategy');
  });

  it('File Format - gVCF [SKFP-722]', () => {
    cy.validateFacetFilter('File Format', 'GVCF', 'gvcf', /^18,686$/, 1);
    cy.validateFacetRank(4, 'File Format');
  });

  it('Platform - Illumina', () => {
    cy.validateFacetFilter('Platform', 'Illumina', 'Illumina', /^73,561$/, 1);
    cy.validateFacetRank(5, 'Platform');
  });

  it('Instrument Model - HiSeq X Ten', () => {
    cy.validateFacetFilter('Instrument Model', 'HiSeq X Ten', 'HiSeq X Ten', /^17,235$/, 1);
    cy.validateFacetRank(6, 'Instrument Model');
  });

  it('Library Strand - Unstranded', () => {
    cy.validateFacetFilter('Library Strand', 'Unstranded', 'Unstranded', /^33,423$/, 1);
    cy.validateFacetRank(7, 'Library Strand');
  });

  it('Is Paired End - Controlled', () => {
    cy.get('[aria-expanded="true"] [data-cy="FilterContainer_Is Paired End"]').should('exist');
    cy.wait(1000);
    cy.clickAndIntercept('input[type="radio"][value="true"]', 'POST', '**/graphql', 12);
    cy.validatePillSelectedQuery('Is Paired End', ['True'], 1);
    cy.validateTableResultsCount(/^49,743$/);
    cy.validateFacetRank(8, 'Is Paired End');
  });

  it('Repository - Gen3', () => {
    cy.validateFacetFilter('Repository', 'Gen3', 'gen3', /^83,714$/, 1);
    cy.validateFacetRank(9, 'Repository');
  });

  it('ACL - Phs002330.c1', () => {
    cy.validateFacetFilter('ACL', 'Phs002330.c1', 'phs002330.c1', /^12,097$/, 1);
    cy.validateFacetRank(10, 'ACL');
  });
});
