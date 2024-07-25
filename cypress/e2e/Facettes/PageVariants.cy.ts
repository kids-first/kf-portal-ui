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
    cy.validateFacetFilter('Study Code', 'KF-EATF', 'KF-EATF', /^32,359,129$/);
    cy.validateFacetRank(0, 'Study Code');
  });
});

describe('Page des variants (Variant) - Filtrer avec les facettes', () => {
  beforeEach(() => {
    cy.visitVariantsPage('?sharedFilterId=efbd0b69-3d16-4796-af2a-d590cdb99d1e');
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

  it('Search by variant locus - 11-119345794-C-T', () => {
    cy.get('[class*="SearchLabel_title"]').contains('Search by variant').should('exist'); //data-cy="SearchLabel_Title"

    cy.get('[class*="SearchLabel_tooltipIcon"]').trigger('mouseover', {eventConstructor: 'MouseEvent', force: true}); //data-cy="SearchLabel_InfoCircleOutlined"
    cy.get('div[class="ant-tooltip-inner"]').contains('Enter Variant Locus, Gene Symbol, Gene Alias, Gene AA Change, dbSNP ID, ClinVar ID, Ensembl ID, refseq ID').should('exist');

    cy.typeAndIntercept('[class*="ant-select-show-search"]', '11-119345794-c-t', 'POST', '*/grapgql', 3); //data-cy="SearchAutocomplete_Select"
    cy.get('[class*="ant-select-dropdown"] [class*="ant-select-item"]').contains('11-119345794-C-T').should('exist'); //data-cy="Search_Dropdown"
    cy.get('[class*="ant-select-dropdown"] [class*="ant-select-item"]').eq(0).clickAndWait({force: true}); //data-cy="Search_Dropdown"

    cy.get('[class="ant-tag"]').contains('11-119345794-C-T').should('exist'); //data-cy="Tag_11-119345794-C-T"
    cy.get('[class*="QueryBar_selected"]').find('[class*="QueryPill_field"]').contains('Variant ID').should('exist');
    cy.get('[class*="QueryBar_selected"]').find('[class*="QueryValues_value"]').contains('11-119345794-C-T').should('exist');
    cy.validateTableResultsCount(/^1 Result$/);

    cy.get('[data-icon="close-circle"]').clickAndWait({force: true});
    cy.get('[class*="ant-select-show-search"] [class="ant-tag"]').should('not.exist'); //data-cy="Tag_11-119345794-C-T"
  });

  it('Search by gene symbol - PRDX1', () => {
    cy.typeAndIntercept('[class*="ant-select-show-search"]', 'prdx1', 'POST', '* /grapgql', 3); //data-cy="SearchAutocomplete_Select"
    cy.get('[class*="ant-select-dropdown"] [class*="ant-select-item"]').contains('1-').should('exist');
    cy.get('[class*="ant-select-dropdown"] [class*="ant-select-item"]').eq(0).clickAndWait({force: true}); //data-cy="Search_Dropdown"

    cy.get('[class="ant-tag"]').should('exist');
    cy.get('[class*="QueryBar_selected"]').find('[class*="QueryPill_field"]').contains('Variant ID').should('exist');
    cy.validateTableResultsCount(/^1 Result$/);

    cy.get('[data-icon="close-circle"]').clickAndWait({force: true});
    cy.get('[class*="ant-select-show-search"] [class="ant-tag"]').should('not.exist'); //data-cy="Tag_11-119345794-C-T"
  });

  it('Search by gene alias - NKEFA [SKFP-622]', () => {
    cy.typeAndIntercept('[class*="ant-select-show-search"]', 'nkefa', 'POST', '* /grapgql', 3); //data-cy="SearchAutocomplete_Select"
    cy.get('[class*="ant-select-dropdown"] [class*="ant-select-item"]').contains('1-').should('exist');
    cy.get('[class*="ant-select-dropdown"] [class*="ant-select-item"]').eq(0).clickAndWait({force: true}); //data-cy="Search_Dropdown"

    cy.get('[class="ant-tag"]').should('exist');
    cy.get('[class*="QueryBar_selected"]').find('[class*="QueryPill_field"]').contains('Variant ID').should('exist');
    cy.validateTableResultsCount(/^1 Result$/);

    cy.get('[data-icon="close-circle"]').clickAndWait({force: true});
    cy.get('[class*="ant-select-show-search"] [class="ant-tag"]').should('not.exist'); //data-cy="Tag_11-119345794-C-T"
  });

  it('Search by gene AA change - p.Val136Met', () => {
    cy.typeAndIntercept('[class*="ant-select-show-search"]', 'p.val136met', 'POST', '* /grapgql', 3); //data-cy="SearchAutocomplete_Select"
    cy.get('[class*="ant-select-dropdown"] [class*="ant-select-item"]').contains('2-').should('exist');
    cy.get('[class*="ant-select-dropdown"] [class*="ant-select-item"]').eq(0).clickAndWait({force: true}); //data-cy="Search_Dropdown"

    cy.get('[class="ant-tag"]').should('exist');
    cy.get('[class*="QueryBar_selected"]').find('[class*="QueryPill_field"]').contains('Variant ID').should('exist');
    cy.validateTableResultsCount(/^1 Result$/);

    cy.get('[data-icon="close-circle"]').clickAndWait({force: true});
    cy.get('[class*="ant-select-show-search"] [class="ant-tag"]').should('not.exist'); //data-cy="Tag_11-119345794-C-T"
  });

  it('Search by dbSNB ID - rs3814762', () => {
    cy.typeAndIntercept('[class*="ant-select-show-search"]', 'RS3814762', 'POST', '* /grapgql', 3); //data-cy="SearchAutocomplete_Select"
    cy.get('[class*="ant-select-dropdown"] [class*="ant-select-item"]').contains('11-119345794-C-T').should('exist'); //data-cy="Search_Dropdown"
    cy.get('[class*="ant-select-dropdown"] [class*="ant-select-item"]').eq(0).clickAndWait({force: true}); //data-cy="Search_Dropdown"

    cy.get('[class="ant-tag"]').contains('11-119345794-C-T').should('exist'); //data-cy="Tag_11-119345794-C-T"
    cy.get('[class*="QueryBar_selected"]').find('[class*="QueryPill_field"]').contains('Variant ID').should('exist');
    cy.get('[class*="QueryBar_selected"]').find('[class*="QueryValues_value"]').contains('11-119345794-C-T').should('exist');
    cy.validateTableResultsCount(/^1 Result$/);

    cy.get('[data-icon="close-circle"]').clickAndWait({force: true});
    cy.get('[class*="ant-select-show-search"] [class="ant-tag"]').should('not.exist'); //data-cy="Tag_11-119345794-C-T"
  });

  it('Search by ClinVar ID - 167299', () => {
    cy.typeAndIntercept('[class*="ant-select-show-search"]', '167299', 'POST', '* /grapgql', 3); //data-cy="SearchAutocomplete_Select"
    cy.get('[class*="ant-select-dropdown"] [class*="ant-select-item"]').contains('11-119345794-C-T').should('exist'); //data-cy="Search_Dropdown"
    cy.get('[class*="ant-select-dropdown"] [class*="ant-select-item"]').eq(0).clickAndWait({force: true}); //data-cy="Search_Dropdown"

    cy.get('[class="ant-tag"]').contains('11-119345794-C-T').should('exist'); //data-cy="Tag_11-119345794-C-T"
    cy.get('[class*="QueryBar_selected"]').find('[class*="QueryPill_field"]').contains('Variant ID').should('exist');
    cy.get('[class*="QueryBar_selected"]').find('[class*="QueryValues_value"]').contains('11-119345794-C-T').should('exist');
    cy.validateTableResultsCount(/^1 Result$/);

    cy.get('[data-icon="close-circle"]').clickAndWait({force: true});
    cy.get('[class*="ant-select-show-search"] [class="ant-tag"]').should('not.exist'); //data-cy="Tag_11-119345794-C-T"
  });

  it('Search by Ensembl ID - ENST00000619721', () => {
    cy.typeAndIntercept('[class*="ant-select-show-search"]', 'enst00000619721', 'POST', '* /grapgql', 3); //data-cy="SearchAutocomplete_Select"
    cy.get('[class*="ant-select-dropdown"] [class*="ant-select-item"]').contains('11-').should('exist');
    cy.get('[class*="ant-select-dropdown"] [class*="ant-select-item"]').eq(0).clickAndWait({force: true}); //data-cy="Search_Dropdown"

    cy.get('[class="ant-tag"]').should('exist');
    cy.get('[class*="QueryBar_selected"]').find('[class*="QueryPill_field"]').contains('Variant ID').should('exist');
    cy.validateTableResultsCount(/^1 Result$/);

    cy.get('[data-icon="close-circle"]').clickAndWait({force: true});
    cy.get('[class*="ant-select-show-search"] [class="ant-tag"]').should('not.exist'); //data-cy="Tag_11-119345794-C-T"
  });

  it('Search by refseq ID - NM_031433.4', () => {
    cy.typeAndIntercept('[class*="ant-select-show-search"]', 'nm_031433.4', 'POST', '* /grapgql', 3); //data-cy="SearchAutocomplete_Select"
    cy.get('[class*="ant-select-dropdown"] [class*="ant-select-item"]').contains('11-').should('exist');
    cy.get('[class*="ant-select-dropdown"] [class*="ant-select-item"]').eq(0).clickAndWait({force: true}); //data-cy="Search_Dropdown"

    cy.get('[class="ant-tag"]').should('exist');
    cy.get('[class*="QueryBar_selected"]').find('[class*="QueryPill_field"]').contains('Variant ID').should('exist');
    cy.validateTableResultsCount(/^1 Result$/);

    cy.get('[data-icon="close-circle"]').clickAndWait({force: true});
    cy.get('[class*="ant-select-show-search"] [class="ant-tag"]').should('not.exist'); //data-cy="Tag_11-119345794-C-T"
  });

  it('Variant Type - SNV', () => {
    cy.validateFacetFilter('Variant Type', 'SNV', 'SNV', /^24,361,857$/, 1);
    cy.validateFacetRank(0, 'Variant Type');
  });

  it('Consequence - Intron', () => {
    cy.validateFacetFilter('Consequence', 'Intron', 'intron', /^19,246,383$/, 1);
    cy.validateFacetRank(1, 'Consequence');
  });

  it('Consequence - Missense', () => {
    cy.validateFacetFilter('Consequence', 'Missense', 'missense', /^112,775$/, 1);
  });

  it('Variant External Reference - DbSNP', () => {
    cy.validateFacetFilter('Variant External Reference', 'DbSNP', 'DBSNP', /^27,054,485$/, 1);
    cy.validateFacetRank(2, 'Variant External Reference');
  });

  it('Chromosome - 1', () => {
    cy.validateFacetFilter('Chromosome', '1', '1', /^2,503,111$/, 1);
    cy.validateFacetRank(3, 'Chromosome');
  });

  it('Position', () => {
    cy.validateFacetNumFilter('Position', '100000', /^16,050$/, false, 1);
    cy.validateFacetRank(4, 'Position');
  });

  it('Zygosity - Heterozygote', () => {
    cy.validateFacetFilter('Zygosity', 'Heterozygote', 'HET', /^32,079,268$/, 1);
    cy.validateFacetRank(5, 'Zygosity');
  });

  it('Transmission - Autosomal Recessive', () => {
    cy.validateFacetFilter('Transmission', 'Autosomal Recessive', 'autosomal_recessive', /^6,611,031$/, 1);
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

  it('Search by gene symbol - PRDX1 [SKFP-939]', () => {
    cy.get('[class*="SearchLabel_title"]').contains('Search by gene').should('exist'); //data-cy="SearchLabel_Title"

    cy.get('[class*="SearchLabel_tooltipIcon"]').trigger('mouseover', {eventConstructor: 'MouseEvent', force: true}); //data-cy="SearchLabel_InfoCircleOutlined"
    cy.get('div[class="ant-tooltip-inner"]').contains('Enter a Gene Symbol, Gene Alias or Ensemble ID').should('exist');

    cy.typeAndIntercept('[class*="ant-select-show-search"]', 'prdx1', 'POST', '*/grapgql', 2); //data-cy="SearchAutocomplete_Select"
    cy.get('[class*="ant-select-dropdown"] [class*="ant-select-item"]').contains('PRDX1').should('exist'); //data-cy="Search_Dropdown"
    cy.get('[class*="ant-select-dropdown"] [class*="ant-select-item"]').eq(0).clickAndWait({force: true}); //data-cy="Search_Dropdown"

    cy.get('[class="ant-tag"]').contains('PRDX1').should('exist'); //data-cy="Tag_PRDX1"
    cy.get('[class*="QueryBar_selected"]').find('[class*="QueryPill_field"]').contains('Gene').should('exist');
    cy.get('[class*="QueryBar_selected"]').find('[class*="QueryValues_value"]').contains('PRDX1').should('exist');
    cy.validateTableResultsCount(/^516$/);

    cy.get('[data-icon="close-circle"]').clickAndWait({force: true});
    cy.get('[class*="ant-select-show-search"] [class="ant-tag"]').should('not.exist'); //data-cy="Tag_PRDX1"
  });

  it('Search by gene alias - NKEFA', () => {
    cy.typeAndIntercept('[class*="ant-select-show-search"]', 'nkefa', 'POST', '* /grapgql', 2); //data-cy="SearchAutocomplete_Select"
    cy.get('[class*="ant-select-dropdown"] [class*="ant-select-item"]').contains('PRDX1').should('exist'); //data-cy="Search_Dropdown"
    cy.get('[class*="ant-select-dropdown"] [class*="ant-select-item"]').eq(0).clickAndWait({force: true}); //data-cy="Search_Dropdown"

    cy.get('[class="ant-tag"]').contains('PRDX1').should('exist'); //data-cy="Tag_PRDX1"
    cy.get('[class*="QueryBar_selected"]').find('[class*="QueryPill_field"]').contains('Gene').should('exist');
    cy.get('[class*="QueryBar_selected"]').find('[class*="QueryValues_value"]').contains('PRDX1').should('exist');
    cy.validateTableResultsCount(/^516$/);

    cy.get('[data-icon="close-circle"]').clickAndWait({force: true});
    cy.get('[class*="ant-select-show-search"] [class="ant-tag"]').should('not.exist'); //data-cy="Tag_PRDX1"
  });

  it('Search by Ensembl ID - ENSG00000117450', () => {
    cy.typeAndIntercept('[class*="ant-select-show-search"]', 'ensg00000117450', 'POST', '* /grapgql', 2); //data-cy="SearchAutocomplete_Select"
    cy.get('[class*="ant-select-dropdown"] [class*="ant-select-item"]').contains('PRDX1').should('exist'); //data-cy="Search_Dropdown"
    cy.get('[class*="ant-select-dropdown"] [class*="ant-select-item"]').eq(0).clickAndWait({force: true}); //data-cy="Search_Dropdown"

    cy.get('[class="ant-tag"]').contains('PRDX1').should('exist'); //data-cy="Tag_PRDX1"
    cy.get('[class*="QueryBar_selected"]').find('[class*="QueryPill_field"]').contains('Gene').should('exist');
    cy.get('[class*="QueryBar_selected"]').find('[class*="QueryValues_value"]').contains('PRDX1').should('exist');
    cy.validateTableResultsCount(/^516$/);

    cy.get('[data-icon="close-circle"]').clickAndWait({force: true});
    cy.get('[class*="ant-select-show-search"] [class="ant-tag"]').should('not.exist'); //data-cy="Tag_PRDX1"
  });

  it('Gene Type - Protein Coding', () => {
    cy.validateFacetFilter('Gene Type', 'Protein Coding', 'protein_coding', /^15,238,452$/, 1);
    cy.validateFacetRank(0, 'Gene Type');
  });

  it('Gene External Reference - OMIM', () => {
    cy.validateFacetFilter('Gene External Reference', 'OMIM', 'OMIM', /^4,579,384$/, 1);
    cy.validateFacetRank(1, 'Gene External Reference');
  });

  it('gnomAD pLI', () => {
    cy.validateFacetNumFilter('gnomAD pLI', '0.01', /^7,450,643$/, false, 1);
    cy.validateFacetRank(2, 'gnomAD pLI');
  });

  it('gnomAD LOEUF', () => {
    cy.validateFacetNumFilter('gnomAD LOEUF', '0.05', /^20,617$/, false, 1);
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

  it('DDD - Autism and Syndromic Intellectual Disability', () => {
    cy.validateFacetFilter('DDD', 'Autism and Syndromic Intellectual Disability', 'Autism and Syndromic Intellectual Disability', /^1,544$/, 1);
    cy.validateFacetRank(7, 'DDD');
  });

  it('COSMIC - Leukaemia', () => {
    cy.validateFacetFilter('COSMIC', 'Leukaemia', 'leukaemia', /^10,328$/, 1);
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
    cy.validateFacetFilter('ClinVar', 'Likely Benign', 'Likely_benign', /^37,333$/, 1);
    cy.validateFacetRank(0, 'ClinVar');
  });

  it('VEP - MODIFIER', () => {
    cy.validateFacetFilter('VEP', 'MODIFIER', 'MODIFIER', /^32,056,652$/, 1);
    cy.validateFacetRank(1, 'VEP');
  });

  it('CADD (Raw)', () => {
    cy.validateFacetNumFilter('CADD (Raw)', '0.01', /^16,878$/, false, 1);
    cy.validateFacetRank(2, 'CADD (Raw)');
  });

  it('CADD (Phred)', () => {
    cy.validateFacetNumFilter('CADD (Phred)', '0.01', /^3,437$/, false, 1);
    cy.validateFacetRank(3, 'CADD (Phred)');
  });

  it('DANN', () => {
    cy.validateFacetNumFilter('DANN', '0.1', /^818$/, false, 1);
    cy.validateFacetRank(4, 'DANN');
  });

  it('FATHMM - Tolerated', () => {
    cy.validateFacetFilter('FATHMM', 'Tolerated', 'T', /^79,913$/, 1);
    cy.validateFacetRank(5, 'FATHMM');
  });

  it('LRT - Neutral', () => {
    cy.validateFacetFilter('LRT', 'Neutral', 'N', /^48,245$/, 1);
    cy.validateFacetRank(6, 'LRT');
  });

  it('PolyPhen-2 HVAR - Benign', () => {
    cy.validateFacetFilter('PolyPhen-2 HVAR', 'Benign', 'B', /^60,432$/, 1);
    cy.validateFacetRank(7, 'PolyPhen-2 HVAR');
  });

  it('REVEL', () => {
    cy.validateFacetNumFilter('REVEL', '0.01', /^2,753$/, false, 1);
    cy.validateFacetRank(8, 'REVEL');
  });

  it('SpliceAI', () => {
    cy.validateFacetNumFilter('SpliceAI', '0.01', /^8,589,370$/, false, 1);
    cy.validateFacetRank(9, 'SpliceAI');
  });

  it('SIFT - Tolerated', () => {
    cy.validateFacetFilter('SIFT', 'Tolerated', 'T', /^60,613$/, 1);
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
    cy.validateFacetNumFilter('KF Allele Frequency', '0.01', /^17,512,325$/, false, 1);
    cy.validateFacetRank(0, 'KF Allele Frequency');
  });

  it('gnomAD Genome 2.1.1', () => {
    cy.validateFacetNumFilter('gnomAD Genome 2.1.1', '0.01', /^10,227,849$/, false, 1);
    cy.validateFacetRank(1, 'gnomAD Genome 2.1.1');
  });

  it('gnomAD Genome 3.1.2', () => {
    cy.validateFacetNumFilter('gnomAD Genome 3.1.2', '0.01', /^13,410,289$/, false, 1);
    cy.validateFacetRank(2, 'gnomAD Genome 3.1.2');
  });

  it('gnomAD Exome 2.1.1', () => {
    cy.validateFacetNumFilter('gnomAD Exome 2.1.1', '0.01', /^211,175$/, false, 1);
    cy.validateFacetRank(3, 'gnomAD Exome 2.1.1');
  });

  it('TopMed', () => {
    cy.validateFacetNumFilter('TopMed', '0.01', /^11,270,523$/, false, 1);
    cy.validateFacetRank(4, 'TopMed');
  });

  it('1000 Genomes', () => {
    cy.validateFacetNumFilter('1000 Genomes', '0.01', /^125,526$/, false, 1);
    cy.validateFacetRank(5, '1000 Genomes');
  });
});