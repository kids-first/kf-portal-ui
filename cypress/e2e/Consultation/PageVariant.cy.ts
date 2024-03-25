/// <reference types="Cypress" />
import '../../support/commands';

beforeEach(() => {
  cy.login();
  cy.visitVariantEntityPage('11-119345794-C-T', 1);
});

describe('Page d\'un variant - Vérifier les informations affichées', () => {
  it('Titre', () => {
    cy.get('[class*="EntityTitle"]').contains('chr11:g.119345794C>T');
    cy.get('[class*="EntityTitle"]').contains('GRCh38');
    cy.get('[class*="EntityTitle"]').contains('Germline');
    cy.get('[class*="EntityTitle"]').find('[class*="variantTag"]').should('exist');
  });

  it('Panneau Summary', () => {
    // Banner
    cy.get('a[class*="VariantEntity_symbolLink"]').eq(0).contains('MFRP').should('exist');
    cy.get('a[class*="VariantEntity_ensemblLink"]').eq(0).contains('Ensembl').should('exist');
    cy.get('div[class*="EntityVariantSummary_bannerWrapper"]').find('[class="ant-space-item"]').eq(3).contains('p.Val136/579Met').should('exist');
    cy.get('div[class*="EntityVariantSummary_bannerWrapper"]').find('[class="ant-space-item"]').eq(4).contains('Consequence').should('exist');
    cy.get('div[class*="EntityVariantSummary_bannerWrapper"]').find('[class="ant-space-item"]').find('svg[class*="Cell_moderateImpact"]').should('exist');
    cy.get('div[class*="EntityVariantSummary_bannerWrapper"]').find('[class="ant-space-item"]').eq(5).contains('Missense').should('exist');
    cy.get('div[class*="EntityVariantSummary_bannerWrapper"]').find('[class="ant-space-item"]').eq(6).contains('ClinVar').should('exist');
    cy.get('div[class*="EntityVariantSummary_bannerWrapper"]').find('[class="ant-space-item"]').eq(7).find('[class*="ant-tag-green"]').should('exist');
    cy.get('div[class*="EntityVariantSummary_bannerWrapper"]').find('[class="ant-space-item"]').eq(10).contains('Participants').should('exist');
    cy.get('div[class*="EntityVariantSummary_bannerWrapper"]').find('[class="ant-space-item"]').eq(11).contains('135 / 242(5.58e-1)').should('exist');
    cy.get('div[class*="EntityVariantSummary_bannerWrapper"]').find('[class*="VariantEntity_participant"]').find('a').contains('135').should('exist');
    cy.get('div[class*="EntityVariantSummary_bannerWrapper"]').find('[class="ant-space-item"]').eq(12).contains('gnomAD').should('exist');
    cy.get('div[class*="EntityVariantSummary_bannerWrapper"]').find('[class="ant-space-item"]').eq(13).find('div[class*="ExternalLink_fuiExternalLink"]').contains('2.46e-1').should('exist');
    // Info
    cy.get('div[class*="EntityVariantSummary_infoWrapper"]').find('div[class*="ant-space-item"]').eq(1).find('div[class*="ExternalLink_fuiExternalLink"]').contains('ENST00000619721').should('exist');
    cy.get('div[class*="EntityVariantSummary_infoWrapper"]').find('div[class*="ant-space-item"]').eq(2).find('svg[class*="VariantEntity_canonicalIcon"]').should('exist');
    cy.get('div[class*="EntityVariantSummary_infoWrapper"]').find('div[class*="ant-space-item"]').eq(3).find('div[class*="ExternalLink_fuiExternalLink"]').contains('NM_031433.4').should('exist');
    cy.get('div[class*="EntityVariantSummary_infoWrapper"]').find('[class*="ant-typography"]').eq(0).contains('c.406/1740C>T').should('exist');
    cy.get('div[class*="EntityVariantSummary_infoWrapper"]').find('div[class*="ant-space-item"]').eq(4).find('div[class*="ExternalLink_fuiExternalLink"]').contains('rs3814762').should('exist');
    // Details
    cy.get('div[class*="EntityVariantSummary_score"]').find('[class*="VariantEntity_functionalScores"]').eq(0).contains('Functional Scores').should('exist');
    cy.get('div[class*="EntityVariantSummary_score"]').find('[class*="ant-descriptions-item-label"]').eq(0).contains('SIFT').should('exist');
    cy.get('div[class*="EntityVariantSummary_score"]').find('[class*="ant-descriptions-item-content"]').eq(0).contains('-').should('exist');
    cy.get('div[class*="EntityVariantSummary_score"]').find('[class*="ant-descriptions-item-label"]').eq(1).contains('FATHMM').should('exist');
    cy.get('div[class*="EntityVariantSummary_score"]').find('[class*="ant-descriptions-item-content"]').eq(1).contains('-').should('exist');
    cy.get('div[class*="EntityVariantSummary_score"]').find('[class*="ant-descriptions-item-label"]').eq(2).contains('CADD (Raw)').should('exist');
    cy.get('div[class*="EntityVariantSummary_score"]').find('[class*="ant-descriptions-item-content"]').eq(2).contains('-1.152731').should('exist');
    cy.get('div[class*="EntityVariantSummary_score"]').find('[class*="ant-descriptions-item-label"]').eq(3).contains('CADD (Phred)').should('exist');
    cy.get('div[class*="EntityVariantSummary_score"]').find('[class*="ant-descriptions-item-content"]').eq(3).contains('0.003').should('exist');
    cy.get('div[class*="EntityVariantSummary_score"]').find('[class*="ant-descriptions-item-label"]').eq(4).contains('DANN').should('exist');
    cy.get('div[class*="EntityVariantSummary_score"]').find('[class*="ant-descriptions-item-content"]').eq(4).contains('0.8564649342891089').should('exist');
    cy.get('div[class*="EntityVariantSummary_geneSplice"]').find('[class*="EntityVariantSummary_detailsTitle"]').eq(0).contains('Gene Constraints').should('exist');
    cy.get('div[class*="EntityVariantSummary_geneSplice"]').find('[class*="ant-descriptions-item-label"]').eq(0).contains('pLI').should('exist');
    cy.get('div[class*="EntityVariantSummary_geneSplice"]').find('[class*="ant-descriptions-item-content"]').eq(0).contains('1.3093e-15').should('exist');
    cy.get('div[class*="EntityVariantSummary_geneSplice"]').find('[class*="ant-descriptions-item-label"]').eq(1).contains('LOEUF').should('exist');
    cy.get('div[class*="EntityVariantSummary_geneSplice"]').find('[class*="ant-descriptions-item-content"]').eq(1).contains('1.223').should('exist');
    cy.get('div[class*="EntityVariantSummary_geneSplice"]').find('[class*="EntityVariantSummary_detailsTitle"]').eq(1).contains('Splice Altering').should('exist');
    cy.get('div[class*="EntityVariantSummary_geneSplice"]').find('[class*="ant-descriptions-item-label"]').eq(2).contains('SpliceAI').should('exist');
    cy.get('div[class*="EntityVariantSummary_geneSplice"]').find('[class*="ant-descriptions-item-content"]').eq(2).contains('0.01').should('exist');
    cy.get('div[class*="EntityVariantSummary_geneSplice"]').find('[class*="ant-descriptions-item-content"]').eq(2).find('[class*="ant-tag"]').contains('AL').should('exist');
    cy.get('div[class*="EntityVariantSummary_omim"]').find('[class*="EntityVariantSummary_detailsTitle"]').eq(0).contains('Associated Conditions (OMIM)').should('exist');
    cy.get('div[class*="EntityVariantSummary_omim"]').find('[class*="ant-descriptions-item-content"]').eq(0).find('div[class*="ExternalLink_fuiExternalLink"]').contains('Microphthalmia, isolated 5').should('exist');
    cy.get('div[class*="EntityVariantSummary_omim"]').find('[class*="ant-descriptions-item-content"]').eq(0).find('[class*="ant-tag-blue"]').contains('AR').should('exist');
    cy.get('div[class*="EntityVariantSummary_omim"]').find('[class*="ant-descriptions-item-content"]').eq(1).find('div[class*="ExternalLink_fuiExternalLink"]').contains('Nanophthalmos 2').should('exist');
  });

  it('Panneau Gene Consequences', () => {
    cy.get('[id="consequence"]').find('h4[class*="EntityNestedTable_title"]').eq(0).contains('Consequence').should('exist');
    cy.get('[id="consequence"]').find('[class*="ant-collapse-header-text"]').find('div[class*="ant-space-item"]').eq(0).contains('Transcripts').should('exist');
    // Main table
    cy.get('[id="consequence"]').find('thead').find('th[class="ant-table-cell"]').eq(0).contains('Gene').should('exist');
    cy.get('[id="consequence"]').find('thead').find('th[class="ant-table-cell"]').eq(1).contains('Gene Type').should('exist');
    cy.get('[id="consequence"]').find('thead').find('th[class="ant-table-cell"]').eq(2).contains('pLI').should('exist');
    cy.get('[id="consequence"]').find('thead').find('th[class="ant-table-cell"]').eq(3).contains('LOEUF').should('exist');
    cy.get('[id="consequence"]').find('thead').find('th[class="ant-table-cell"]').eq(4).contains('SpliceAI').should('exist');
    cy.get('[id="consequence"]').find('tbody').find('td[class="ant-table-cell"]').eq(0).find('div[class*="ExternalLink_fuiExternalLink"]').contains('MFRP').should('exist');
    cy.get('[id="consequence"]').find('tbody').find('td[class="ant-table-cell"]').eq(0).find('[class*="VariantEntity_pickedIcon"]').should('exist');
    cy.get('[id="consequence"]').find('tbody').find('td[class="ant-table-cell"]').eq(1).contains('Protein Coding').should('exist');
    cy.get('[id="consequence"]').find('tbody').find('td[class="ant-table-cell"]').eq(2).contains('1.31e-15').should('exist');
    cy.get('[id="consequence"]').find('tbody').find('td[class="ant-table-cell"]').eq(3).contains('1.223').should('exist');
    cy.get('[id="consequence"]').find('tbody').find('td[class="ant-table-cell"]').eq(4).contains('0.01').should('exist');
    cy.get('[id="consequence"]').find('tbody').find('td[class="ant-table-cell"]').eq(4).find('[class*="ant-tag"]').contains('AL').should('exist');
    // Nested table
    cy.get('[id="consequence"]').find('tbody').find('td[class*="ant-table-row-expand-icon-cell"]').eq(0).find('button').click({force: true});
    cy.get('[id="consequence"]').find('div[class*="VariantEntity_expandedTable"]').find('thead').find('th[class="ant-table-cell"]').eq(0).contains('AA').should('exist');
    cy.get('[id="consequence"]').find('div[class*="VariantEntity_expandedTable"]').find('thead').find('th[class="ant-table-cell"]').eq(1).contains('Consequence').should('exist');
    cy.get('[id="consequence"]').find('div[class*="VariantEntity_expandedTable"]').find('thead').find('th[class="ant-table-cell"]').eq(2).contains('Coding DNA').should('exist');
    cy.get('[id="consequence"]').find('div[class*="VariantEntity_expandedTable"]').find('thead').find('th[class="ant-table-cell"]').eq(3).contains('Prediction').should('exist');
    cy.get('[id="consequence"]').find('div[class*="VariantEntity_expandedTable"]').find('thead').find('th[class="ant-table-cell"]').eq(4).contains('Conservation').should('exist');
    cy.get('[id="consequence"]').find('div[class*="VariantEntity_expandedTable"]').find('thead').find('th[class="ant-table-cell"]').eq(5).contains('Transcripts').should('exist');
    cy.get('[id="consequence"]').find('div[class*="VariantEntity_expandedTable"]').find('thead').find('th[class="ant-table-cell"]').eq(6).contains('RefSeq').should('exist');
    cy.get('[id="consequence"]').find('div[class*="VariantEntity_expandedTable"]').find('tbody').find('td[class="ant-table-cell"]').eq(0).contains('p.Val136/579Met').should('exist');
    cy.get('[id="consequence"]').find('div[class*="VariantEntity_expandedTable"]').find('tbody').find('td[class="ant-table-cell"]').eq(1).find('svg[class*="Cell_moderateImpact"]').should('exist');
    cy.get('[id="consequence"]').find('div[class*="VariantEntity_expandedTable"]').find('tbody').find('td[class="ant-table-cell"]').eq(1).contains('Missense').should('exist');
    cy.get('[id="consequence"]').find('div[class*="VariantEntity_expandedTable"]').find('tbody').find('td[class="ant-table-cell"]').eq(2).contains('c.406/1740C>T').should('exist');
    cy.get('[id="consequence"]').find('div[class*="VariantEntity_expandedTable"]').find('tbody').find('td[class="ant-table-cell"]').eq(3).find('span[class*="ant-typography"]').eq(0).contains('CADD (Raw)').should('exist');
    cy.get('[id="consequence"]').find('div[class*="VariantEntity_expandedTable"]').find('tbody').find('td[class="ant-table-cell"]').eq(3).find('span[class*="ant-typography"]').eq(1).contains('-1.152731').should('exist');
    cy.get('[id="consequence"]').find('div[class*="VariantEntity_expandedTable"]').find('tbody').find('td[class="ant-table-cell"]').eq(3).find('span[class*="ant-typography"]').eq(2).contains('CADD (Phred)').should('exist');
    cy.get('[id="consequence"]').find('div[class*="VariantEntity_expandedTable"]').find('tbody').find('td[class="ant-table-cell"]').eq(3).find('span[class*="ant-typography"]').eq(3).contains('0.003').should('exist');
    cy.get('[id="consequence"]').find('div[class*="VariantEntity_expandedTable"]').find('tbody').find('td[class="ant-table-cell"]').eq(3).find('[class*="ExpandableCell_fuiExpandableCellBtn"]').contains('See more').should('exist');
    cy.get('[id="consequence"]').find('div[class*="VariantEntity_expandedTable"]').find('tbody').find('td[class="ant-table-cell"]').eq(4).contains('PhyloP17Way').should('exist');
    cy.get('[id="consequence"]').find('div[class*="VariantEntity_expandedTable"]').find('tbody').find('td[class="ant-table-cell"]').eq(4).contains('-1.031').should('exist');
    cy.get('[id="consequence"]').find('div[class*="VariantEntity_expandedTable"]').find('tbody').find('td[class="ant-table-cell"]').eq(5).find('div[class*="ExternalLink_fuiExternalLink"]').contains('ENST00000619721').should('exist');
    cy.get('[id="consequence"]').find('div[class*="VariantEntity_expandedTable"]').find('tbody').find('td[class="ant-table-cell"]').eq(5).find('svg[class*="VariantEntity_canonicalIcon"]').should('exist');
    cy.get('[id="consequence"]').find('div[class*="VariantEntity_expandedTable"]').find('tbody').find('td[class="ant-table-cell"]').eq(6).find('div[class*="ExternalLink_fuiExternalLink"]').contains('NM_031433.4').should('exist');
  });

  it('Panneau Frequency - Kids First Studies', () => {
    cy.get('[id="frequency"]').find('h4[class*="EntityTable_title"]').eq(0).contains('Frequency').should('exist');
    cy.get('[id="frequency"]').find('[class*="ant-collapse-header-text"]').find('div[class*="ant-space-item"]').eq(0).contains('Kids First Studies').should('exist');
    cy.get('[id="frequency"]').find('thead').find('th[class="ant-table-cell"]').eq(0).contains('Studies').should('exist');
    cy.get('[id="frequency"]').find('thead').find('th[class="ant-table-cell"]').eq(1).contains('Participants').should('exist');
    cy.get('[id="frequency"]').find('thead').find('th[class="ant-table-cell"]').eq(2).contains('Frequency').should('exist');
    cy.get('[id="frequency"]').find('thead').find('th[class="ant-table-cell"]').eq(3).contains('# ALT Alleles').should('exist');
    cy.get('[id="frequency"]').find('thead').find('th[class="ant-table-cell"]').eq(4).contains('# Homozygotes').should('exist');
    cy.get('[id="frequency"]').find('[class*="ant-table-row"]').eq(0).find('td[class="ant-table-cell"]').eq(0).contains('KF-EATF').should('exist');
    cy.get('[id="frequency"]').find('[class*="ant-table-row"]').eq(0).find('td[class="ant-table-cell"]').eq(1).contains('135 / 242').should('exist');
    cy.get('[id="frequency"]').find('[class*="ant-table-row"]').eq(0).find('td[class="ant-table-cell"]').eq(2).contains('3.37e-1').should('exist');
    cy.get('[id="frequency"]').find('[class*="ant-table-row"]').eq(0).find('td[class="ant-table-cell"]').eq(3).contains('163').should('exist');
    cy.get('[id="frequency"]').find('[class*="ant-table-row"]').eq(0).find('td[class="ant-table-cell"]').eq(4).contains('28').should('exist');
    cy.get('[id="frequency"]').find('tfoot[class="ant-table-summary"]').find('td[class*="ant-table-cell"]').eq(1).contains(' / ').should('exist');
    cy.get('[id="frequency"]').find('tfoot[class="ant-table-summary"]').find('td[class*="ant-table-cell"]').eq(2).contains('e-').should('exist');
    cy.get('[id="frequency"]').find('tfoot[class="ant-table-summary"]').find('td[class*="ant-table-cell"]').eq(3).contains(/\d{1}/).should('exist');
    cy.get('[id="frequency"]').find('tfoot[class="ant-table-summary"]').find('td[class*="ant-table-cell"]').eq(4).contains(/\d{1}/).should('exist');
  });

  it('Panneau Frequency - Public Cohorts', () => {
    cy.get('[class*="EntityTable_container"]').eq(1).find('[class*="ant-collapse-header-text"]').find('div[class*="ant-space-item"]').eq(0).contains('Public Cohorts').should('exist');
    cy.get('[class*="EntityTable_container"]').eq(1).find('thead').find('th[class="ant-table-cell"]').eq(0).contains('Cohort').should('exist');
    cy.get('[class*="EntityTable_container"]').eq(1).find('thead').find('th[class="ant-table-cell"]').eq(1).contains('# ALT Alleles').should('exist');
    cy.get('[class*="EntityTable_container"]').eq(1).find('thead').find('th[class="ant-table-cell"]').eq(2).contains('# Alleles (ALT + REF)').should('exist');
    cy.get('[class*="EntityTable_container"]').eq(1).find('thead').find('th[class="ant-table-cell"]').eq(3).contains('# Homozygotes').should('exist');
    cy.get('[class*="EntityTable_container"]').eq(1).find('thead').find('th[class="ant-table-cell"]').eq(4).contains('Frequency').should('exist');
    cy.get('[data-row-key="topmed"]').find('td[class="ant-table-cell"]').eq(1).contains('30,191').should('exist');
    cy.get('[data-row-key="topmed"]').find('td[class="ant-table-cell"]').eq(2).contains('125,568').should('exist');
    cy.get('[data-row-key="topmed"]').find('td[class="ant-table-cell"]').eq(3).contains('4,544').should('exist');
    cy.get('[data-row-key="topmed"]').find('td[class="ant-table-cell"]').eq(4).contains('2.40e-1').should('exist');
    cy.get('[data-row-key="gnomadGenomes3"]').find('td[class="ant-table-cell"]').eq(1).contains('37,345').should('exist');
    cy.get('[data-row-key="gnomadGenomes3"]').find('td[class="ant-table-cell"]').eq(2).contains('151,884').should('exist');
    cy.get('[data-row-key="gnomadGenomes3"]').find('td[class="ant-table-cell"]').eq(3).contains('5,541').should('exist');
    cy.get('[data-row-key="gnomadGenomes3"]').find('td[class="ant-table-cell"]').eq(4).contains('2.46e-1').should('exist');
    cy.get('[data-row-key="gnomadGenomes2_1"]').find('td[class="ant-table-cell"]').eq(1).contains('7,710').should('exist');
    cy.get('[data-row-key="gnomadGenomes2_1"]').find('td[class="ant-table-cell"]').eq(2).contains('31,280').should('exist');
    cy.get('[data-row-key="gnomadGenomes2_1"]').find('td[class="ant-table-cell"]').eq(3).contains('1,125').should('exist');
    cy.get('[data-row-key="gnomadGenomes2_1"]').find('td[class="ant-table-cell"]').eq(4).contains('2.46e-1').should('exist');
    cy.get('[data-row-key="gnomadExomes2_1"]').find('td[class="ant-table-cell"]').eq(1).contains('65,587').should('exist');
    cy.get('[data-row-key="gnomadExomes2_1"]').find('td[class="ant-table-cell"]').eq(2).contains('247,454').should('exist');
    cy.get('[data-row-key="gnomadExomes2_1"]').find('td[class="ant-table-cell"]').eq(3).contains('9,618').should('exist');
    cy.get('[data-row-key="gnomadExomes2_1"]').find('td[class="ant-table-cell"]').eq(4).contains('2.65e-1').should('exist');
    cy.get('[data-row-key="oneThousandsGenomes"]').find('td[class="ant-table-cell"]').eq(1).contains('-').should('exist');
    cy.get('[data-row-key="oneThousandsGenomes"]').find('td[class="ant-table-cell"]').eq(2).contains('-').should('exist');
    cy.get('[data-row-key="oneThousandsGenomes"]').find('td[class="ant-table-cell"]').eq(3).contains('-').should('exist');
    cy.get('[data-row-key="oneThousandsGenomes"]').find('td[class="ant-table-cell"]').eq(4).contains('-').should('exist');
  });

  it('Panneau Pathogenicity', () => {
    cy.get('[id="pathogenicity"]').find('h4[class*="EntityTable_title"]').eq(0).contains('Pathogenicity').should('exist');
    cy.get('[id="pathogenicity"]').find('[class*="ant-collapse-header-text"]').contains('ClinVar').should('exist');
    cy.get('[id="pathogenicity"]').find('[class*="ant-collapse-header-text"]').contains('167299').should('exist');
    cy.get('[id="pathogenicity"]').find('thead').find('th[class="ant-table-cell"]').eq(0).contains('Interpretation').should('exist');
    cy.get('[id="pathogenicity"]').find('thead').find('th[class="ant-table-cell"]').eq(1).contains('Condition').should('exist');
    cy.get('[id="pathogenicity"]').find('tr[class*="ant-table-row"]').eq(0).find('td[class="ant-table-cell"]').eq(0).contains('Benign').should('exist');
    cy.get('[id="pathogenicity"]').find('tr[class*="ant-table-row"]').eq(0).find('td[class="ant-table-cell"]').eq(1).contains('not specified').should('exist');
    cy.get('[id="pathogenicity"]').find('tr[class*="ant-table-row"]').eq(0).find('td[class="ant-table-cell"]').eq(1).find('[class*="ColorTag_default"]').contains('GER').should('exist');
    cy.get('[id="pathogenicity"]').find('tr[class*="ant-table-row"]').eq(1).find('td[class="ant-table-cell"]').eq(0).contains('Benign').should('exist');
    cy.get('[id="pathogenicity"]').find('tr[class*="ant-table-row"]').eq(1).find('td[class="ant-table-cell"]').eq(1).contains('Retinal degeneration').should('exist');
    cy.get('[id="pathogenicity"]').find('tr[class*="ant-table-row"]').eq(1).find('td[class="ant-table-cell"]').eq(1).find('[class*="ColorTag_default"]').contains('GER').should('exist');
    cy.get('[id="pathogenicity"]').find('tr[class*="ant-table-row"]').eq(2).find('td[class="ant-table-cell"]').eq(0).contains('Benign').should('exist');
    cy.get('[id="pathogenicity"]').find('tr[class*="ant-table-row"]').eq(2).find('td[class="ant-table-cell"]').eq(1).contains('Isolated microphthalmia 5').should('exist');
    cy.get('[id="pathogenicity"]').find('tr[class*="ant-table-row"]').eq(2).find('td[class="ant-table-cell"]').eq(1).find('[class*="ColorTag_default"]').contains('GER').should('exist');
    cy.get('[id="pathogenicity"]').find('tr[class*="ant-table-row"]').eq(3).find('td[class="ant-table-cell"]').eq(0).contains('Benign').should('exist');
    cy.get('[id="pathogenicity"]').find('tr[class*="ant-table-row"]').eq(3).find('td[class="ant-table-cell"]').eq(1).contains('Isolated microphthalmia 6').should('exist');
    cy.get('[id="pathogenicity"]').find('tr[class*="ant-table-row"]').eq(3).find('td[class="ant-table-cell"]').eq(1).find('[class*="ColorTag_default"]').contains('GER').should('exist');
  });

  it('Panneau Condition - Gene Phenotype', () => {
    cy.get('[id="condition"]').find('h4[class*="EntityTable_title"]').eq(0).contains('Condition').should('exist');
    cy.get('[id="condition"]').find('[class*="ant-collapse-header-text"]').contains('Gene - Phenotype Association').should('exist');
    cy.get('[id="condition"]').find('thead').find('th[class="ant-table-cell"]').eq(0).contains('Source').should('exist');
    cy.get('[id="condition"]').find('thead').find('th[class="ant-table-cell"]').eq(1).contains('Gene').should('exist');
    cy.get('[id="condition"]').find('thead').find('th[class="ant-table-cell"]').eq(2).contains('Condition').should('exist');
    cy.get('[data-row-key="0-mfrp"]').find('td[class="ant-table-cell"]').eq(0).contains('Orphanet').should('exist');
    cy.get('[data-row-key="0-mfrp"]').find('td[class="ant-table-cell"]').eq(1).contains('MFRP').should('exist');
    cy.get('[data-row-key="0-mfrp"]').find('td[class="ant-table-cell"]').eq(2).contains('Nanophthalmos').should('exist');
    cy.get('[data-row-key="0-mfrp"]').find('td[class="ant-table-cell"]').eq(2).find('[class*="ColorTag_default"]').contains('AD').should('exist');
    cy.get('[data-row-key="2-mfrp-606227"]').find('td[class="ant-table-cell"]').eq(0).contains('OMIM').should('exist');
    cy.get('[data-row-key="2-mfrp-606227"]').find('td[class="ant-table-cell"]').eq(1).contains('MFRP (MIM:').should('exist');
    cy.get('[data-row-key="2-mfrp-606227"]').find('td[class="ant-table-cell"]').eq(2).contains('Microphthalmia, Isolated 5 (MIM:').should('exist');
    cy.get('[data-row-key="2-mfrp-606227"]').find('td[class="ant-table-cell"]').eq(2).find('[class*="ColorTag_default"]').contains('AR').should('exist');
    cy.get('[data-row-key="4-mfrp"]').find('td[class="ant-table-cell"]').eq(0).contains('HPO').should('exist');
    cy.get('[data-row-key="4-mfrp"]').find('td[class="ant-table-cell"]').eq(1).contains('MFRP').should('exist');
    cy.get('[data-row-key="4-mfrp"]').find('td[class="ant-table-cell"]').eq(2).contains('Microphthalmia').should('exist');
    cy.get('[data-row-key="6-mfrp"]').find('td[class="ant-table-cell"]').eq(0).contains('DDD').should('exist');
    cy.get('[data-row-key="6-mfrp"]').find('td[class="ant-table-cell"]').eq(1).contains('MFRP').should('exist');
    cy.get('[data-row-key="6-mfrp"]').find('td[class="ant-table-cell"]').eq(2).contains('MICROPHTHALMIA ISOLATED TYPE 5').should('exist');
  });
});

describe('Page d\'un variant - Valider les liens disponibles', () => {
  it('Lien Gene du panneau Summary', () => {
    // data-cy="Summary_Gene_ExternalLink"
    cy.get('a[class*="VariantEntity_symbolLink"]').eq(0).should('have.attr', 'href', 'https://omim.org/entry/606227');
  });

  it('Lien Ensembl du panneau Summary', () => {
    // data-cy="Summary_Ensembl_ExternalLink"
    cy.get('a[class*="VariantEntity_ensemblLink"]').eq(0).should('have.attr', 'href', 'https://www.ensembl.org/id/ENST00000619721');
  });

  it('Lien ClinVar du panneau Summary', () => {
    cy.get('div[class*="EntityVariantSummary_bannerWrapper"]').find('[class="ant-space-item"]').eq(7).find('[class*="ant-tag-green"]').find('a') // data-cy="Summary_ClinVar_ExternalLink"
    .should('have.attr', 'href', 'https://www.ncbi.nlm.nih.gov/clinvar/variation/167299');
  });

  it('Lien Participants du panneau Summary', () => {
    cy.get('div[class*="EntityVariantSummary_bannerWrapper"]').find('[class="ant-space-item"]').eq(11).find('a').click({force: true});
    cy.get('[class*="Participants_participantTabWrapper"]').should('exist'); // data-cy="ProTable_Participants"
    cy.get('[class*="QueryBar_selected"]').find('[class*="QueryPill_field"]').contains('Participant ID').should('exist');
    cy.get('[class*="QueryBar_selected"]').find('[class*="QueryValues_value"]').contains('PT').should('exist');
    cy.validateTableResultsCount(/^135$/);
  });

  it('Lien gnomAD du panneau Summary', () => {
    cy.get('div[class*="EntityVariantSummary_bannerWrapper"]').find('[class="ant-space-item"]').eq(13).find('a') // data-cy="Summary_gnomAD_ExternalLink"
    .should('have.attr', 'href', 'https://gnomad.broadinstitute.org/variant/11-119345794-C-T?dataset=gnomad_r3');
  });

  it('Lien Ensembl Transcript du panneau Summary', () => {
    cy.get('div[class*="EntityVariantSummary_infoWrapper"]').find('div[class*="ant-space-item"]').eq(0).find('a') // data-cy="Summary_Ensembl_Transcript_ExternalLink"
    .should('have.attr', 'href', 'https://www.ensembl.org/id/ENST00000619721');
  });

  it('Lien RefSeq du panneau Summary', () => {
    cy.get('div[class*="EntityVariantSummary_infoWrapper"]').find('a').eq(1) // data-cy="Summary_RefSeq_ExternalLink"
    .should('have.attr', 'href', 'https://www.ncbi.nlm.nih.gov/nuccore/NM_031433.4?report=graph');
  });

  it('Lien dbSNP du panneau Summary', () => {
    cy.get('div[class*="EntityVariantSummary_infoWrapper"]').find('a').eq(2) // data-cy="Summary_sbSNP_ExternalLink"
    .should('have.attr', 'href', 'https://www.ncbi.nlm.nih.gov/snp/rs3814762');
  });

  it('Lien OMIM du panneau Summary', () => {
    cy.get('div[class*="EntityVariantSummary_omim"]').find('[class*="ant-descriptions-item-content"]').eq(0).find('a') // data-cy="Summary_Omim_ExternalLink"
    .should('have.attr', 'href', 'https://www.omim.org/entry/611040');
  });

  it('Lien du gène du panneau Consequence', () => {
    cy.get('[id="consequence"]').find('tbody').find('td[class="ant-table-cell"]').eq(0).find('[href]').eq(0).should('have.attr', 'href', 'https://www.omim.org/entry/606227');
  });

  it('Lien \'See more\' de Prediction du panneau Consequence', () => {
    cy.get('[id="consequence"]').find('tbody').find('td[class*="ant-table-row-expand-icon-cell"]').eq(0).find('button').click({force: true});
    cy.get('[id="consequence"]').find('div[class*="VariantEntity_expandedTable"]').find('tbody').find('td[class*="ant-table-cell"]').eq(3).find('[class*="ExpandableCell_fuiExpandableCellBtn"]').contains('See more').click({force: true});
    cy.get('[id="consequence"]').find('div[class*="VariantEntity_expandedTable"]').find('tbody').find('td[class*="ant-table-cell"]').eq(3).find('span[class*="ant-typography"]').eq(0).contains('CADD (Raw)').should('exist');
    cy.get('[id="consequence"]').find('div[class*="VariantEntity_expandedTable"]').find('tbody').find('td[class*="ant-table-cell"]').eq(3).find('span[class*="ant-typography"]').eq(1).contains('-1.152731').should('exist');
    cy.get('[id="consequence"]').find('div[class*="VariantEntity_expandedTable"]').find('tbody').find('td[class*="ant-table-cell"]').eq(3).find('span[class*="ant-typography"]').eq(2).contains('CADD (Phred)').should('exist');
    cy.get('[id="consequence"]').find('div[class*="VariantEntity_expandedTable"]').find('tbody').find('td[class*="ant-table-cell"]').eq(3).find('span[class*="ant-typography"]').eq(3).contains('0.003').should('exist');
    cy.get('[id="consequence"]').find('div[class*="VariantEntity_expandedTable"]').find('tbody').find('td[class*="ant-table-cell"]').eq(3).find('span[class*="ant-typography"]').eq(4).contains('DANN').should('exist');
    cy.get('[id="consequence"]').find('div[class*="VariantEntity_expandedTable"]').find('tbody').find('td[class*="ant-table-cell"]').eq(3).find('[class*="ExpandableCell_fuiExpandableCellBtn"]').contains('See less').click({force: true});
    cy.get('[id="consequence"]').find('div[class*="VariantEntity_expandedTable"]').find('tbody').find('td[class*="ant-table-cell"]').eq(3).find('span[class*="ant-typography"]').eq(4).should('not.exist');
    cy.get('[id="consequence"]').find('tbody').find('td[class*="ant-table-row-expand-icon-cell"]').eq(0).find('button').click({force: true});
  });
  
  it('Lien du transcript du panneau Consequence', () => {
    cy.get('[id="consequence"]').find('tbody').find('td[class*="ant-table-row-expand-icon-cell"]').eq(0).find('button').click({force: true});
    cy.get('[id="consequence"]').find('div[class*="VariantEntity_expandedTable"]').find('tbody').find('td[class*="ant-table-cell"]').eq(5).find('a').should('have.attr', 'href', 'https://www.ensembl.org/id/ENST00000619721');
    cy.get('[id="consequence"]').find('tbody').find('td[class*="ant-table-row-expand-icon-cell"]').eq(0).find('button').click({force: true});
  });

  it('Lien du RefSeq du panneau Consequence', () => {
    cy.get('[id="consequence"]').find('tbody').find('td[class*="ant-table-row-expand-icon-cell"]').eq(0).find('button').click({force: true});
    cy.get('[id="consequence"]').find('div[class*="VariantEntity_expandedTable"]').find('tbody').find('td[class*="ant-table-cell"]').eq(6).find('a').should('have.attr', 'href', 'https://www.ncbi.nlm.nih.gov/nuccore/NM_031433.4?report=graph');
    cy.get('[id="consequence"]').find('tbody').find('td[class*="ant-table-row-expand-icon-cell"]').eq(0).find('button').click({force: true});
  });

  it('Lien Studies du panneau Kids First Studies', () => {
    cy.get('[id="frequency"]').find('tr[class*="ant-table-row"]').eq(0).find('td[class="ant-table-cell"]').eq(0).find('a').click({force: true});
    cy.get('[class*="Participants_participantTabWrapper"]').should('exist'); // data-cy="ProTable_Participants"
    cy.get('[class*="QueryBar_selected"]').find('[class*="QueryPill_field"]').contains('Study Code').should('exist');
    cy.get('[class*="QueryBar_selected"]').find('[class*="QueryValues_value"]').contains('KF-EATF').should('exist');
  });

  it('Lien Participants du panneau Kids First Studies [SKFP-957]', () => {
    cy.get('[id="frequency"]').find('tr[class*="ant-table-row"]').eq(0).find('td[class="ant-table-cell"]').eq(1).find('a').click({force: true});
    cy.get('[class*="Participants_participantTabWrapper"]').should('exist'); // data-cy="ProTable_Participants"
    cy.get('[class*="QueryBar_selected"]').find('[class*="QueryPill_field"]').contains('Participant ID').should('exist');
    cy.get('[class*="QueryBar_selected"]').find('[class*="QueryValues_value"]').contains('PT').should('exist');
    cy.validateTableResultsCount(/^135$/);
  });

  it('Lien TopMed du panneau Public Cohort', () => {
    cy.get('[data-row-key="topmed"]').find('td[class="ant-table-cell"]').eq(0).find('[href]')
    .should('have.attr', 'href', 'https://bravo.sph.umich.edu/freeze8/hg38/variant/snv/11-119345794-C-T');
  });

  it('Lien gnomAD Genome (v3.1.2) du panneau Public Cohort', () => {
    cy.get('[data-row-key="gnomadGenomes3"]').find('td[class="ant-table-cell"]').eq(0).find('[href]')
    .should('have.attr', 'href', 'https://gnomad.broadinstitute.org/variant/11-119345794-C-T?dataset=gnomad_r3');
  });

  it('Lien ClinVar du panneau Pathogenicity', () => {
    cy.get('[id="pathogenicity"]').find('div[class="ant-collapse-header"]').find('[href]') // data-cy="Pathogenicity_ClinVar_167299_ExternalLink"
    .should('have.attr', 'href', 'https://www.ncbi.nlm.nih.gov/clinvar/variation/167299');
  });

  it('Lien de la condition Orphanet du panneau Condition - Gene Phenotype', () => {
    cy.get('[data-row-key="0-mfrp"]').find('td[class="ant-table-cell"]').eq(2).find('[href]')
    .should('have.attr', 'href', 'https://www.orpha.net/consor/cgi-bin/Disease_Search.php?lng=EN&data_id=10378');
  });

  it('Lien OMIM du gène du panneau Condition - Gene Phenotype', () => {
    cy.get('[data-row-key*="2-mfrp-606227"]').find('td[class="ant-table-cell"]').eq(1).find('[href]')
    .should('have.attr', 'href', 'https://www.omim.org/entry/606227');
  });

  it('Lien OMIM de la condition du panneau Condition - Gene Phenotype', () => {
    cy.get('[data-row-key*="2-mfrp-606227"]').find('td[class="ant-table-cell"]').eq(2).find('[href]').first()
    .should('have.attr', 'href', 'https://www.omim.org/entry/611040');
  });

  it('Lien HPO de la condition du panneau Condition - Gene Phenotype', () => {
    cy.get('[data-row-key*="4-mfrp"]').find('td[class="ant-table-cell"]').eq(2).find('[href]').eq(0)
    .should('have.attr', 'href', 'https://hpo.jax.org/app/browse/term/HP:0008323');
  });

  it('Lien \'See more\' de la condition du panneau Condition - Gene Phenotype', () => {
    cy.get('[data-row-key="4-mfrp"]').contains('See more').click({force: true});
    cy.get('[data-row-key="4-mfrp"]').contains('Foveoschisis').should('exist');
    cy.get('[data-row-key="4-mfrp"]').contains('See less').click({force: true});
    cy.get('[data-row-key="4-mfrp"]').contains('Foveoschisis').should('not.exist');
  });
});

describe('Page d\'un variant - Valider les panneaux masquables', () => {
  it('Panneau Consequence - Transcripts', () => {
    cy.get('[id="consequence"]').find('div[class*="ant-collapse-content-active"]').should('exist');
    cy.get('[id="consequence"]').find('span[class*="ant-collapse-arrow"]').click({force: true});
    cy.get('[id="consequence"]').find('div[class*="ant-collapse-content-inactive ant-collapse-content-hidden"]').should('exist');
    cy.get('[id="consequence"]').find('span[class*="ant-collapse-arrow"]').click({force: true});
    cy.get('[id="consequence"]').find('div[class*="ant-collapse-content-active"]').should('exist');
  });

  it('Panneau Frequency - Kids First Studies', () => {
    cy.get('[id="frequency"]').find('[class*="Collapse_fuiCollapse"]').find('div[class*="ant-collapse-content-active"]').should('exist');
    cy.get('[id="frequency"]').find('[class*="Collapse_fuiCollapse"]').find('span[class*="ant-collapse-arrow"]').click({force: true});
    cy.get('[id="frequency"]').find('[class*="Collapse_fuiCollapse"]').find('div[class*="ant-collapse-content-inactive ant-collapse-content-hidden"]').should('exist');
    cy.get('[id="frequency"]').find('[class*="Collapse_fuiCollapse"]').find('span[class*="ant-collapse-arrow"]').click({force: true});
    cy.get('[id="frequency"]').find('[class*="Collapse_fuiCollapse"]').find('div[class*="ant-collapse-content-active"]').should('exist');
  });

  it('Panneau Frequency - Public Cohorts', () => {
    cy.get('[class*="EntityTable_container"]').eq(2).find('[class*="Collapse_fuiCollapse"]').find('div[class*="ant-collapse-content-active"]').should('exist');
    cy.get('[class*="EntityTable_container"]').eq(2).find('[class*="Collapse_fuiCollapse"]').find('span[class*="ant-collapse-arrow"]').click({force: true});
    cy.get('[class*="EntityTable_container"]').eq(2).find('[class*="Collapse_fuiCollapse"]').find('div[class*="ant-collapse-content-inactive ant-collapse-content-hidden"]').should('exist');
    cy.get('[class*="EntityTable_container"]').eq(2).find('[class*="Collapse_fuiCollapse"]').find('span[class*="ant-collapse-arrow"]').click({force: true});
    cy.get('[class*="EntityTable_container"]').eq(2).find('[class*="Collapse_fuiCollapse"]').find('div[class*="ant-collapse-content-active"]').should('exist');
  });

  it('Panneau Pathogenicity - ClinVar', () => {
    cy.get('[id="pathogenicity"]').find('[class*="Collapse_fuiCollapse"]').find('div[class*="ant-collapse-content-active"]').should('exist');
    cy.get('[id="pathogenicity"]').find('[class*="Collapse_fuiCollapse"]').find('span[class*="ant-collapse-arrow"]').click({force: true});
    cy.get('[id="pathogenicity"]').find('[class*="Collapse_fuiCollapse"]').find('div[class*="ant-collapse-content-inactive ant-collapse-content-hidden"]').should('exist');
    cy.get('[id="pathogenicity"]').find('[class*="Collapse_fuiCollapse"]').find('span[class*="ant-collapse-arrow"]').click({force: true});
    cy.get('[id="pathogenicity"]').find('[class*="Collapse_fuiCollapse"]').find('div[class*="ant-collapse-content-active"]').should('exist');
  });

  it('Panneau Condition - Gene Phenotype', () => {
    cy.get('[id="condition"]').find('[class*="Collapse_fuiCollapse"]').find('div[class*="ant-collapse-content-active"]').should('exist');
    cy.get('[id="condition"]').find('[class*="Collapse_fuiCollapse"]').find('span[class*="ant-collapse-arrow"]').click({force: true});
    cy.get('[id="condition"]').find('[class*="Collapse_fuiCollapse"]').find('div[class*="ant-collapse-content-inactive ant-collapse-content-hidden"]').should('exist');
    cy.get('[id="condition"]').find('[class*="Collapse_fuiCollapse"]').find('span[class*="ant-collapse-arrow"]').click({force: true});
    cy.get('[id="condition"]').find('[class*="Collapse_fuiCollapse"]').find('div[class*="ant-collapse-content-active"]').should('exist');
  });
});
