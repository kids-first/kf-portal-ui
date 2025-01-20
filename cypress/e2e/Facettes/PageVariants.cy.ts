/// <reference types="cypress"/>
import '../../support/commands';

beforeEach(() => {
  cy.login();
});

describe('Page des variants (Participant) - Filtrer avec les facettes', () => {
  beforeEach(() => {
    cy.visitVariantsPage();
    cy.get('[data-cy="SidebarMenuItem_Participant"]').clickAndWait({force: true});
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

  it('Study Code - KF-EATF', () => {
    cy.validateFacetFilter('Study Code', 'KF-EATF', 'KF-EATF', /^13,186,116$/);
    cy.validateFacetRank(0, 'Study Code');
  });
});

describe('Page des variants (Variant) - Filtrer avec les facettes', () => {
  beforeEach(() => {
    cy.visitVariantsPage();
    cy.get('[data-cy="SidebarMenuItem_Variant"]').clickAndWait({force: true});
    cy.get('[class*="Filters_filterExpandBtnWrapper"] button[class*="ant-btn-link"]').clickAndWait({force: true}); //data-cy="ExpandAll"
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

  it('Search by variant locus - 1-156176849-G-A', () => {
    cy.get('[class*="SearchLabel_title"]').contains('Search by variant').should('exist'); //data-cy="SearchLabel_Title"

    cy.get('[class*="SearchLabel_tooltipIcon"]').trigger('mouseover', {eventConstructor: 'MouseEvent', force: true}); //data-cy="SearchLabel_InfoCircleOutlined"
    cy.get('div[class="ant-tooltip-inner"]').contains('Enter Variant Locus, Gene Symbol, Gene Alias, Gene AA Change, dbSNP ID, ClinVar ID, Ensembl ID, refseq ID').should('exist');

    cy.typeAndIntercept('[class*="ant-select-show-search"]', '1-156176849-G-A', 'POST', '*/grapgql', 3); //data-cy="SearchAutocomplete_Select"
    cy.get('[class*="ant-select-dropdown"] [class*="ant-select-item"]').contains('1-156176849-G-A').should('exist'); //data-cy="Search_Dropdown"
    cy.get('[class*="ant-select-dropdown"] [class*="ant-select-item"]').eq(0).clickAndWait({force: true}); //data-cy="Search_Dropdown"

    cy.get('[class="ant-tag"]').contains('1-156176849-G-A').should('exist'); //data-cy="Tag_1-156176849-G-A"
    cy.get('[class*="QueryBar_selected"] [class*="QueryPill_field"]').contains('Variant ID').should('exist');
    cy.get('[class*="QueryBar_selected"] [class*="QueryValues_value"]').contains('1-156176849-G-A').should('exist');
    cy.validateTableResultsCount(/^1 Result$/);

    cy.get('[data-icon="close-circle"]').clickAndWait({force: true});
    cy.get('[class*="ant-select-show-search"] [class="ant-tag"]').should('not.exist'); //data-cy="Tag_1-156176849-G-A"
  });

  it('Search by gene symbol - SEMA4A', () => {
    cy.typeAndIntercept('[class*="ant-select-show-search"]', 'sema4a', 'POST', '* /grapgql', 3); //data-cy="SearchAutocomplete_Select"
    cy.get('[class*="ant-select-dropdown"] [class*="ant-select-item"]').contains('1-').should('exist');
    cy.get('[class*="ant-select-dropdown"] [class*="ant-select-item"]').eq(0).clickAndWait({force: true}); //data-cy="Search_Dropdown"

    cy.get('[class="ant-tag"]').should('exist');
    cy.get('[class*="QueryBar_selected"] [class*="QueryPill_field"]').contains('Variant ID').should('exist');
    cy.validateTableResultsCount(/^1 Result$/);

    cy.get('[data-icon="close-circle"]').clickAndWait({force: true});
    cy.get('[class*="ant-select-show-search"] [class="ant-tag"]').should('not.exist'); //data-cy="Tag_1-156176849-G-A"
  });

  it('Search by gene alias - SEMAB [SKFP-622]', () => {
    cy.typeAndIntercept('[class*="ant-select-show-search"]', 'semab', 'POST', '* /grapgql', 3); //data-cy="SearchAutocomplete_Select"
    cy.get('[class*="ant-select-dropdown"] [class*="ant-select-item"]').contains('1-').should('exist');
    cy.get('[class*="ant-select-dropdown"] [class*="ant-select-item"]').eq(0).clickAndWait({force: true}); //data-cy="Search_Dropdown"

    cy.get('[class="ant-tag"]').should('exist');
    cy.get('[class*="QueryBar_selected"] [class*="QueryPill_field"]').contains('Variant ID').should('exist');
    cy.validateTableResultsCount(/^1 Result$/);

    cy.get('[data-icon="close-circle"]').clickAndWait({force: true});
    cy.get('[class*="ant-select-show-search"] [class="ant-tag"]').should('not.exist'); //data-cy="Tag_1-156176849-G-A"
  });

  it('Search by gene AA change - p.Val136Met', () => {
    cy.typeAndIntercept('[class*="ant-select-show-search"]', 'p.val136met', 'POST', '* /grapgql', 3); //data-cy="SearchAutocomplete_Select"
    cy.get('[class*="ant-select-dropdown"] [class*="ant-select-item"]').contains('2-').should('exist');
    cy.get('[class*="ant-select-dropdown"] [class*="ant-select-item"]').eq(0).clickAndWait({force: true}); //data-cy="Search_Dropdown"

    cy.get('[class="ant-tag"]').should('exist');
    cy.get('[class*="QueryBar_selected"] [class*="QueryPill_field"]').contains('Variant ID').should('exist');
    cy.validateTableResultsCount(/^1 Result$/);

    cy.get('[data-icon="close-circle"]').clickAndWait({force: true});
    cy.get('[class*="ant-select-show-search"] [class="ant-tag"]').should('not.exist'); //data-cy="Tag_1-156176849-G-A"
  });

  it('Search by dbSNB ID - rs41265017', () => {
    cy.typeAndIntercept('[class*="ant-select-show-search"]', 'rs41265017', 'POST', '* /grapgql', 3); //data-cy="SearchAutocomplete_Select"
    cy.get('[class*="ant-select-dropdown"] [class*="ant-select-item"]').contains('1-156176849-G-A').should('exist'); //data-cy="Search_Dropdown"
    cy.get('[class*="ant-select-dropdown"] [class*="ant-select-item"]').eq(0).clickAndWait({force: true}); //data-cy="Search_Dropdown"

    cy.get('[class="ant-tag"]').contains('1-156176849-G-A').should('exist'); //data-cy="Tag_1-156176849-G-A"
    cy.get('[class*="QueryBar_selected"] [class*="QueryPill_field"]').contains('Variant ID').should('exist');
    cy.get('[class*="QueryBar_selected"] [class*="QueryValues_value"]').contains('1-156176849-G-A').should('exist');
    cy.validateTableResultsCount(/^1 Result$/);

    cy.get('[data-icon="close-circle"]').clickAndWait({force: true});
    cy.get('[class*="ant-select-show-search"] [class="ant-tag"]').should('not.exist'); //data-cy="Tag_1-156176849-G-A"
  });

  it('Search by ClinVar ID - 3362', () => {
    cy.typeAndIntercept('[class*="ant-select-show-search"]', '3362', 'POST', '* /grapgql', 3); //data-cy="SearchAutocomplete_Select"
    cy.get('[class*="ant-select-dropdown"] [class*="ant-select-item"]').contains('1-156176849-G-A').should('exist'); //data-cy="Search_Dropdown"
    cy.get('[class*="ant-select-dropdown"] [class*="ant-select-item"]').eq(0).clickAndWait({force: true}); //data-cy="Search_Dropdown"

    cy.get('[class="ant-tag"]').contains('1-156176849-G-A').should('exist'); //data-cy="Tag_1-156176849-G-A"
    cy.get('[class*="QueryBar_selected"] [class*="QueryPill_field"]').contains('Variant ID').should('exist');
    cy.get('[class*="QueryBar_selected"] [class*="QueryValues_value"]').contains('1-156176849-G-A').should('exist');
    cy.validateTableResultsCount(/^1 Result$/);

    cy.get('[data-icon="close-circle"]').clickAndWait({force: true});
    cy.get('[class*="ant-select-show-search"] [class="ant-tag"]').should('not.exist'); //data-cy="Tag_1-156176849-G-A"
  });

  it('Search by Ensembl ID - ENST00000368285', () => {
    cy.typeAndIntercept('[class*="ant-select-show-search"]', 'ENST00000368285', 'POST', '* /grapgql', 3); //data-cy="SearchAutocomplete_Select"
    cy.get('[class*="ant-select-dropdown"] [class*="ant-select-item"]').contains('1-').should('exist');
    cy.get('[class*="ant-select-dropdown"] [class*="ant-select-item"]').eq(0).clickAndWait({force: true}); //data-cy="Search_Dropdown"

    cy.get('[class="ant-tag"]').should('exist');
    cy.get('[class*="QueryBar_selected"] [class*="QueryPill_field"]').contains('Variant ID').should('exist');
    cy.validateTableResultsCount(/^1 Result$/);

    cy.get('[data-icon="close-circle"]').clickAndWait({force: true});
    cy.get('[class*="ant-select-show-search"] [class="ant-tag"]').should('not.exist'); //data-cy="Tag_1-156176849-G-A"
  });

  it('Search by refseq ID - NM_022367.4', () => {
    cy.typeAndIntercept('[class*="ant-select-show-search"]', 'nm_022367.4', 'POST', '* /grapgql', 3); //data-cy="SearchAutocomplete_Select"
    cy.get('[class*="ant-select-dropdown"] [class*="ant-select-item"]').contains('1-').should('exist');
    cy.get('[class*="ant-select-dropdown"] [class*="ant-select-item"]').eq(0).clickAndWait({force: true}); //data-cy="Search_Dropdown"

    cy.get('[class="ant-tag"]').should('exist');
    cy.get('[class*="QueryBar_selected"] [class*="QueryPill_field"]').contains('Variant ID').should('exist');
    cy.validateTableResultsCount(/^1 Result$/);

    cy.get('[data-icon="close-circle"]').clickAndWait({force: true});
    cy.get('[class*="ant-select-show-search"] [class="ant-tag"]').should('not.exist'); //data-cy="Tag_1-156176849-G-A"
  });
});

describe('Page des variants (Variant) - Filtrer avec les facettes', () => {
  beforeEach(() => {
    cy.visitVariantsPage('?sharedFilterId=efbd0b69-3d16-4796-af2a-d590cdb99d1e');
    cy.get('[data-cy="SidebarMenuItem_Variant"]').clickAndWait({force: true});
    cy.get('[class*="Filters_filterExpandBtnWrapper"] button[class*="ant-btn-link"]').clickAndWait({force: true}); //data-cy="ExpandAll"
  });

  it('Variant Type - SNV', () => {
    cy.validateFacetFilter('Variant Type', 'SNV', 'SNV', /^9,985,395$/, 1);
    cy.validateFacetRank(0, 'Variant Type');
  });

  it('Consequence - Intron', () => {
    cy.validateFacetFilter('Consequence', 'Intron', 'intron', /^7,950,262$/, 1);
    cy.validateFacetRank(1, 'Consequence');
  });

  it('Consequence - Missense', () => {
    cy.validateFacetFilter('Consequence', 'Missense', 'missense', /^39,466$/, 1);
  });

  it('Variant External Reference - DbSNP', () => {
    cy.validateFacetFilter('Variant External Reference', 'DbSNP', 'DBSNP', /^11,283,818$/, 1);
    cy.validateFacetRank(2, 'Variant External Reference');
  });

  it('Chromosome - 1', () => {
    cy.validateFacetFilter('Chromosome', '1', '1', /^2,503,111$/, 1);
    cy.validateFacetRank(3, 'Chromosome');
  });

  it('Position', () => {
    cy.validateFacetNumFilter('MinMax', 'Position', '156176849', /^1$/, false, 1);
    cy.validateFacetRank(4, 'Position');
  });

  it('Zygosity - Heterozygote', () => {
    cy.validateFacetFilter('Zygosity', 'Heterozygote', 'HET', /^13,151,959$/, 1);
    cy.validateFacetRank(5, 'Zygosity');
  });

  it('Transmission - Autosomal Recessive', () => {
    cy.validateFacetFilter('Transmission', 'Autosomal Recessive', 'autosomal_recessive', /^4,205,540$/, 1);
    cy.validateFacetRank(6, 'Transmission');
  });
});

describe('Page des variants (Gene) - Filtrer avec les facettes', () => {
  beforeEach(() => {
    cy.visitVariantsPage('?sharedFilterId=efbd0b69-3d16-4796-af2a-d590cdb99d1e');
    cy.get('[data-cy="SidebarMenuItem_Gene"]').clickAndWait({force: true});
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

describe('Page des variants (Pathogenicity) - Filtrer avec les facettes', () => {
  beforeEach(() => {
    cy.visitVariantsPage('?sharedFilterId=efbd0b69-3d16-4796-af2a-d590cdb99d1e');
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

  it('ClinVar - Likely Benign', () => {
    cy.validateFacetFilter('ClinVar', 'Likely Benign', 'Likely_benign', /^16,591$/, 1);
    cy.validateFacetRank(0, 'ClinVar');
  });

  it('VEP - MODIFIER', () => {
    cy.validateFacetFilter('VEP', 'MODIFIER', 'MODIFIER', /^13,076,823$/, 1);
    cy.validateFacetRank(1, 'VEP');
  });

  it('CADD (Raw)', () => {
    cy.validateFacetNumFilter('Min', 'CADD (Raw)', '0.01', /^33,025$/, false, 1);
    cy.validateFacetRank(2, 'CADD (Raw)');
  });

  it('CADD (Phred)', () => {
    cy.validateFacetNumFilter('Min', 'CADD (Phred)', '0.01', /^37,380$/, false, 1);
    cy.validateFacetRank(3, 'CADD (Phred)');
  });

  it('DANN', () => {
    cy.validateFacetNumFilter('Min', 'DANN', '0.1', /^37,982$/, false, 1);
    cy.validateFacetRank(4, 'DANN');
  });

  it('FATHMM - Tolerated', () => {
    cy.validateFacetFilter('FATHMM', 'Tolerated', 'T', /^29,680$/, 1);
    cy.validateFacetRank(5, 'FATHMM');
  });

  it('LRT - Neutral', () => {
    cy.validateFacetFilter('LRT', 'Neutral', 'N', /^17,974$/, 1);
    cy.validateFacetRank(6, 'LRT');
  });

  it('PolyPhen-2 HVAR - Benign', () => {
    cy.validateFacetFilter('PolyPhen-2 HVAR', 'Benign', 'B', /^22,144$/, 1);
    cy.validateFacetRank(7, 'PolyPhen-2 HVAR');
  });

  it('REVEL', () => {
    cy.validateFacetNumFilter('Min', 'REVEL', '0.01', /^34,200$/, false, 1);
    cy.validateFacetRank(8, 'REVEL');
  });

  it('SpliceAI', () => {
    cy.validateFacetNumFilter('Min', 'SpliceAI', '0.01', /^197,076$/, false, 1);
    cy.validateFacetRank(9, 'SpliceAI');
  });

  it('SIFT - Tolerated', () => {
    cy.validateFacetFilter('SIFT', 'Tolerated', 'T', /^22,698$/, 1);
    cy.validateFacetRank(10, 'SIFT');
  });
});

describe('Page des variants (Frequency) - Filtrer avec les facettes', () => {
  beforeEach(() => {
    cy.visitVariantsPage('?sharedFilterId=efbd0b69-3d16-4796-af2a-d590cdb99d1e');
    cy.get('[data-cy="SidebarMenuItem_Frequency"]').clickAndWait({force: true});
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

  it('KF Allele Frequency', () => {
    cy.validateFacetNumFilter('Max', 'KF Allele Frequency', '0.01', /^7,298,201$/, false, 1);
    cy.validateFacetRank(0, 'KF Allele Frequency');
  });

  it('gnomAD Genome 2.1.1', () => {
    cy.validateFacetNumFilter('Max', 'gnomAD Genome 2.1.1', '0.01', /^4,202,805$/, false, 1);
    cy.validateFacetRank(1, 'gnomAD Genome 2.1.1');
  });

  it('gnomAD Genome 3.1.2', () => {
    cy.validateFacetNumFilter('Max', 'gnomAD Genome 3.1.2', '0.01', /^5,452,655$/, false, 1);
    cy.validateFacetRank(2, 'gnomAD Genome 3.1.2');
  });

  it('gnomAD Exome 2.1.1', () => {
    cy.validateFacetNumFilter('Max', 'gnomAD Exome 2.1.1', '0.01', /^72,518$/, false, 1);
    cy.validateFacetRank(3, 'gnomAD Exome 2.1.1');
  });

  it('TopMed', () => {
    cy.validateFacetNumFilter('Max', 'TopMed', '0.01', /^4,643,297$/, false, 1);
    cy.validateFacetRank(4, 'TopMed');
  });

  it('1000 Genomes', () => {
    cy.validateFacetNumFilter('Max', '1000 Genomes', '0.01', /^34,360$/, false, 1);
    cy.validateFacetRank(5, '1000 Genomes');
  });
});