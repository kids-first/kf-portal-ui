/// <reference types="Cypress" />
import '../../support/commands';

beforeEach(() => {
  cy.login();
  cy.visitVariantEntityPage('11-119345794-C-T', 1);
});

describe('Page d\'un variant - Valider les redirections', () => {
  it('Studies', () => {
    cy.get('a[class*="SummaryHeader_link"]').eq(0).click({force: true}); // data-cy="SummaryHeader_Studies_Button"
    cy.get('[class*="Participants_participantTabWrapper"]').should('exist'); // data-cy="ProTable_Participants"
    cy.get('[class*="QueryBar_selected"]').find('[class*="QueryPill_field"]').contains('Study Code').should('exist');
    cy.get('[class*="QueryBar_selected"]').find('[class*="QueryValues_value"]').contains('KF-EATF').should('exist');
  });
  
  it('Participants', () => {
    cy.get('a[class*="SummaryHeader_link"]').eq(1).click({force: true}); // data-cy="SummaryHeader_Participants_Button"
    cy.get('[class*="Participants_participantTabWrapper"]').should('exist'); // data-cy="ProTable_Participants"
    cy.get('[class*="QueryBar_selected"]').find('[class*="QueryPill_field"]').contains('Participant ID').should('exist');
    cy.get('[class*="QueryBar_selected"]').find('[class*="QueryValues_value"]').contains('PT').should('exist');
  });
});

describe('Page d\'un variant - Vérifier les informations affichées', () => {
  it('Titre', () => {
    cy.get('[class*="EntityTitle"]').contains('chr11:g.119345794C>T');
    cy.get('[class*="EntityTitle"]').contains('Germline');
    cy.get('[class*="EntityTitle"]').find('[class*="variantTag"]').should('exist');
  });
  
  it('Panneau Summary', () => {
    cy.get('a[class*="SummaryHeader_link"]').eq(0).contains('1'); // data-cy="SummaryHeader_Studies_Button"
    cy.get('a[class*="SummaryHeader_link"]').eq(0).contains('Study'); // data-cy="SummaryHeader_Studies_Button"
    cy.get('a[class*="SummaryHeader_link"]').eq(1).contains('135'); // data-cy="SummaryHeader_Participants_Button"
    cy.get('a[class*="SummaryHeader_link"]').eq(1).contains('Participants'); // data-cy="SummaryHeader_Participants_Button"
    cy.get('[id="summary"]').find('[class="ant-descriptions-item-label"]').eq(0).contains('Variant').should('exist');
    cy.get('[id="summary"]').find('[class="ant-descriptions-item-content"]').eq(0).contains('chr11:g.119345794C>T').should('exist');
    cy.get('[id="summary"]').find('[class="ant-descriptions-item-label"]').eq(1).contains('Type').should('exist');
    cy.get('[id="summary"]').find('[class="ant-descriptions-item-content"]').eq(1).contains('SNV').should('exist');
    cy.get('[id="summary"]').find('[class="ant-descriptions-item-label"]').eq(2).contains('Cytoband').should('exist');
    cy.get('[id="summary"]').find('[class="ant-descriptions-item-content"]').eq(2).contains('11q23.3').should('exist');
    cy.get('[id="summary"]').find('[class="ant-descriptions-item-label"]').eq(3).contains('Reference Genome').should('exist');
    cy.get('[id="summary"]').find('[class="ant-descriptions-item-content"]').eq(3).contains('GRCh38').should('exist');
    cy.get('[id="summary"]').find('[class="ant-descriptions-item-label"]').eq(4).contains('Genes').should('exist');
    cy.get('[id="summary"]').find('[class="ant-descriptions-item-content"]').eq(4).contains('MFRP').should('exist');
    cy.get('[id="summary"]').find('[class="ant-descriptions-item-content"]').eq(4).contains('C1QTNF5').should('exist');
    cy.get('[id="summary"]').find('[class="ant-descriptions-item-label"]').eq(5).contains('OMIM').should('exist');
    cy.get('[id="summary"]').find('[class="ant-descriptions-item-content"]').eq(5).contains('606227').should('exist');
    cy.get('[id="summary"]').find('[class="ant-descriptions-item-content"]').eq(5).contains('608752').should('exist');
    cy.get('[id="summary"]').find('[class="ant-descriptions-item-label"]').eq(6).contains('ClinVar').should('exist');
    cy.get('[id="summary"]').find('[class="ant-descriptions-item-content"]').eq(6).contains('Benign, Likely Benign').should('exist');
    cy.get('[id="summary"]').find('[class="ant-descriptions-item-label"]').eq(7).contains('Participants').should('exist');
    cy.get('[id="summary"]').find('[class="ant-descriptions-item-content"]').eq(7).contains('135').should('exist');
    cy.get('[id="summary"]').find('[class="ant-descriptions-item-label"]').eq(8).contains('gnomAD Genome (v3.1.2)').should('exist');
    cy.get('[id="summary"]').find('[class="ant-descriptions-item-content"]').eq(8).contains('2.46e-1').should('exist');
    cy.get('[id="summary"]').find('[class="ant-descriptions-item-label"]').eq(9).contains('Studies').should('exist');
    cy.get('[id="summary"]').find('[class="ant-descriptions-item-content"]').eq(9).contains('5.58e-1').should('exist');
    cy.get('[id="summary"]').find('[class="ant-descriptions-item-label"]').eq(10).contains('ClinVar').should('exist');
    cy.get('[id="summary"]').find('[class="ant-descriptions-item-content"]').eq(10).contains('167299').should('exist');
    cy.get('[id="summary"]').find('[class="ant-descriptions-item-label"]').eq(11).contains('dbSNP').should('exist');
    cy.get('[id="summary"]').find('[class="ant-descriptions-item-content"]').eq(11).contains('rs3814762').should('exist');
  });
  
  it('Panneau Gene Consequences', () => {
    cy.get('[id="consequence"]').find('div[class*="EntityGeneConsequenceSubtitle_wrapper"]').contains('MFRP').should('exist');
    cy.get('[id="consequence"]').find('div[class*="EntityGeneConsequenceSubtitle_wrapper"]').contains('Omim').should('exist');
    cy.get('[id="consequence"]').find('div[class*="EntityGeneConsequenceSubtitle_wrapper"]').contains('606227').should('exist');
    cy.get('[id="consequence"]').find('div[class*="EntityGeneConsequenceSubtitle_wrapper"]').contains('Protein Coding').should('exist');
    cy.get('[id="consequence"]').find('div[class*="EntityGeneConsequenceSubtitle_wrapper"]').contains('SpliceAI').should('exist');
    cy.get('[id="consequence"]').find('div[class*="EntityGeneConsequenceSubtitle_wrapper"]').contains(/^0.01$/).should('exist');
    cy.get('[id="consequence"]').find('div[class*="EntityGeneConsequenceSubtitle_wrapper"]').contains('gnomAD pLI').should('exist');
    cy.get('[id="consequence"]').find('div[class*="EntityGeneConsequenceSubtitle_wrapper"]').contains('1.3093e-15').should('exist');
    cy.get('[id="consequence"]').find('div[class*="EntityGeneConsequenceSubtitle_wrapper"]').contains('gnomAD LOEUF').should('exist');
    cy.get('[id="consequence"]').find('div[class*="EntityGeneConsequenceSubtitle_wrapper"]').contains('1.223').should('exist');
    cy.get('[id="consequence"]').find('thead').find('th[class="ant-table-cell"]').eq(0).contains('AA').should('exist');
    cy.get('[id="consequence"]').find('div[class*="EntityTable_contentTable"]').find('tr[class*="ant-table-row"]').eq(0).find('td[class="ant-table-cell"]').eq(0).contains('p.Val136Met').should('exist');
    cy.get('[id="consequence"]').find('thead').find('th[class="ant-table-cell"]').eq(1).contains('Consequence').should('exist');
    cy.get('[id="consequence"]').find('div[class*="EntityTable_contentTable"]').find('tr[class*="ant-table-row"]').eq(0).find('td[class="ant-table-cell"]').eq(1).contains('Missense').should('exist');
    cy.get('[id="consequence"]').find('thead').find('th[class="ant-table-cell"]').eq(2).contains('Coding DNA').should('exist');
    cy.get('[id="consequence"]').find('div[class*="EntityTable_contentTable"]').find('tr[class*="ant-table-row"]').eq(0).find('td[class="ant-table-cell"]').eq(2).contains('c.406G>A').should('exist');
    cy.get('[id="consequence"]').find('thead').find('th[class="ant-table-cell"]').eq(3).contains('Strand').should('exist');
    cy.get('[id="consequence"]').find('div[class*="EntityTable_contentTable"]').find('tr[class*="ant-table-row"]').eq(0).find('td[class="ant-table-cell"]').eq(3).contains('-1').should('exist');
    cy.get('[id="consequence"]').find('thead').find('th[class="ant-table-cell"]').eq(4).contains('VEP').should('exist');
    cy.get('[id="consequence"]').find('div[class*="EntityTable_contentTable"]').find('tr[class*="ant-table-row"]').eq(0).find('td[class="ant-table-cell"]').eq(4).contains('MODERATE').should('exist');
    cy.get('[id="consequence"]').find('div[class*="EntityTable_contentTable"]').find('tr[class*="ant-table-row"]').eq(0).find('td[class="ant-table-cell"]').eq(4).find('[class*="ant-tag-gold"]').should('exist');
    cy.get('[id="consequence"]').find('thead').find('th[class="ant-table-cell"]').eq(5).contains('Predictions').should('exist');
    cy.get('[id="consequence"]').find('div[class*="EntityTable_contentTable"]').find('tr[class*="ant-table-row"]').eq(0).find('td[class="ant-table-cell"]').eq(5).contains('Cadd:').should('exist');
    cy.get('[id="consequence"]').find('div[class*="EntityTable_contentTable"]').find('tr[class*="ant-table-row"]').eq(0).find('td[class="ant-table-cell"]').eq(5).contains('-1.152731').should('exist');
    cy.get('[id="consequence"]').find('div[class*="EntityTable_contentTable"]').find('tr[class*="ant-table-row"]').eq(0).find('td[class="ant-table-cell"]').eq(5).contains('Dann:').should('exist');
    cy.get('[id="consequence"]').find('div[class*="EntityTable_contentTable"]').find('tr[class*="ant-table-row"]').eq(0).find('td[class="ant-table-cell"]').eq(5).contains('0.8564649342891089').should('exist');
    cy.get('[id="consequence"]').find('thead').find('th[class="ant-table-cell"]').eq(6).contains('Conservation').should('exist');
    cy.get('[id="consequence"]').find('div[class*="EntityTable_contentTable"]').find('tr[class*="ant-table-row"]').eq(0).find('td[class="ant-table-cell"]').eq(6).contains('-1.031').should('exist');
    cy.get('[id="consequence"]').find('thead').find('th[class="ant-table-cell"]').eq(7).contains('Transcript').should('exist');
    cy.get('[id="consequence"]').find('div[class*="EntityTable_contentTable"]').find('tr[class*="ant-table-row"]').eq(0).find('td[class="ant-table-cell"]').eq(7).contains('ENST00000619721').should('exist');
    cy.get('[id="consequence"]').find('thead').find('th[class="ant-table-cell"]').eq(8).contains('RefSeq').should('exist');
    cy.get('[id="consequence"]').find('div[class*="EntityTable_contentTable"]').find('tr[class*="ant-table-row"]').eq(0).find('td[class="ant-table-cell"]').eq(8).contains('NM_031433').should('exist');
    cy.get('[id="consequence"]').contains('6 other transcripts +').should('exist');
    cy.get('[id="consequence"]').find('div[class*="EntityTable_contentTable"]').eq(0).find('tr[class*="ant-table-row"]').eq(1).should('not.exist');
  });
  
  it('Panneau Kids First Studies', () => {
    cy.get('[id="frequencies"]').find('thead').find('th[class="ant-table-cell"]').eq(0).contains('Studies').should('exist');
    cy.get('[id="frequencies"]').find('thead').find('th[class="ant-table-cell"]').eq(1).contains('Participants').should('exist');
    cy.get('[id="frequencies"]').find('thead').find('th[class="ant-table-cell"]').eq(2).contains('Frequency').should('exist');
    cy.get('[id="frequencies"]').find('thead').find('th[class="ant-table-cell"]').eq(3).contains('ALT Alleles').should('exist');
    cy.get('[id="frequencies"]').find('thead').find('th[class="ant-table-cell"]').eq(4).contains('Homozygotes').should('exist');
    cy.get('[id="frequencies"]').find('[class*="ant-table-row"]').eq(0).find('td[class="ant-table-cell"]').eq(0).contains('KF-EATF').should('exist');
    cy.get('[id="frequencies"]').find('[class*="ant-table-row"]').eq(0).find('td[class="ant-table-cell"]').eq(1).contains('135 / 242').should('exist');
    cy.get('[id="frequencies"]').find('[class*="ant-table-row"]').eq(0).find('td[class="ant-table-cell"]').eq(2).contains('3.37e-1').should('exist');
    cy.get('[id="frequencies"]').find('[class*="ant-table-row"]').eq(0).find('td[class="ant-table-cell"]').eq(3).contains('163').should('exist');
    cy.get('[id="frequencies"]').find('[class*="ant-table-row"]').eq(0).find('td[class="ant-table-cell"]').eq(4).contains('28').should('exist');
    cy.get('[id="frequencies"]').find('tfoot[class="ant-table-summary"]').find('td[class*="ant-table-cell"]').eq(1).contains(' / ').should('exist');
    cy.get('[id="frequencies"]').find('tfoot[class="ant-table-summary"]').find('td[class*="ant-table-cell"]').eq(2).contains('e-').should('exist');
    cy.get('[id="frequencies"]').find('tfoot[class="ant-table-summary"]').find('td[class*="ant-table-cell"]').eq(3).contains(/\d{1}/).should('exist');
    cy.get('[id="frequencies"]').find('tfoot[class="ant-table-summary"]').find('td[class*="ant-table-cell"]').eq(4).contains(/\d{1}/).should('exist');
  });
  
  it('Panneau Public Cohorts', () => {
    cy.get('[class*="EntityTable_container"]').eq(2).find('thead').find('th[class="ant-table-cell"]').eq(0).contains('Cohort').should('exist');
    cy.get('[class*="EntityTable_container"]').eq(2).find('thead').find('th[class="ant-table-cell"]').eq(1).contains('ALT Alleles').should('exist');
    cy.get('[class*="EntityTable_container"]').eq(2).find('thead').find('th[class="ant-table-cell"]').eq(2).contains('Alleles (ALT + REF)').should('exist');
    cy.get('[class*="EntityTable_container"]').eq(2).find('thead').find('th[class="ant-table-cell"]').eq(3).contains('Homozygotes').should('exist');
    cy.get('[class*="EntityTable_container"]').eq(2).find('thead').find('th[class="ant-table-cell"]').eq(4).contains('Frequency').should('exist');
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
  
  it('Panneau ClinVar', () => {
    cy.get('[id="pathogenicity"]').find('div[class="ant-collapse-header"]').contains('167299').should('exist');
    cy.get('[id="pathogenicity"]').find('div[class="ant-collapse-header"]').find('svg[class="anticon"]').should('exist');
    cy.get('[id="pathogenicity"]').find('thead').find('th[class="ant-table-cell"]').eq(0).contains('Interpretation').should('exist');
    cy.get('[id="pathogenicity"]').find('thead').find('th[class="ant-table-cell"]').eq(1).contains('Condition').should('exist');
    cy.get('[id="pathogenicity"]').find('thead').find('th[class="ant-table-cell"]').eq(2).contains('Inheritance').should('exist');
    cy.get('[id="pathogenicity"]').find('tr[class*="ant-table-row"]').eq(0).find('td[class="ant-table-cell"]').eq(0).contains('Benign').should('exist');
    cy.get('[id="pathogenicity"]').find('tr[class*="ant-table-row"]').eq(0).find('td[class="ant-table-cell"]').eq(1).contains('not specified').should('exist');
    cy.get('[id="pathogenicity"]').find('tr[class*="ant-table-row"]').eq(0).find('td[class="ant-table-cell"]').eq(2).contains('germline').should('exist');
    cy.get('[id="pathogenicity"]').find('tr[class*="ant-table-row"]').eq(1).find('td[class="ant-table-cell"]').eq(0).contains('Benign').should('exist');
    cy.get('[id="pathogenicity"]').find('tr[class*="ant-table-row"]').eq(1).find('td[class="ant-table-cell"]').eq(1).contains('Retinal degeneration').should('exist');
    cy.get('[id="pathogenicity"]').find('tr[class*="ant-table-row"]').eq(1).find('td[class="ant-table-cell"]').eq(2).contains('germline').should('exist');
    cy.get('[id="pathogenicity"]').find('tr[class*="ant-table-row"]').eq(2).find('td[class="ant-table-cell"]').eq(0).contains('Benign').should('exist');
    cy.get('[id="pathogenicity"]').find('tr[class*="ant-table-row"]').eq(2).find('td[class="ant-table-cell"]').eq(1).contains('Isolated microphthalmia 5').should('exist');
    cy.get('[id="pathogenicity"]').find('tr[class*="ant-table-row"]').eq(2).find('td[class="ant-table-cell"]').eq(2).contains('germline').should('exist');
    cy.get('[id="pathogenicity"]').find('tr[class*="ant-table-row"]').eq(3).find('td[class="ant-table-cell"]').eq(0).contains('Benign').should('exist');
    cy.get('[id="pathogenicity"]').find('tr[class*="ant-table-row"]').eq(3).find('td[class="ant-table-cell"]').eq(1).contains('Isolated microphthalmia 6').should('exist');
    cy.get('[id="pathogenicity"]').find('tr[class*="ant-table-row"]').eq(3).find('td[class="ant-table-cell"]').eq(2).contains('germline').should('exist');
  });
  
  it('Panneau Gene - Phenotype', () => {
    cy.get('[class*="EntityTable_container"]').eq(4).find('thead').find('th[class="ant-table-cell"]').eq(0).contains('Source').should('exist');
    cy.get('[class*="EntityTable_container"]').eq(4).find('thead').find('th[class="ant-table-cell"]').eq(1).contains('Gene').should('exist');
    cy.get('[class*="EntityTable_container"]').eq(4).find('thead').find('th[class="ant-table-cell"]').eq(2).contains('Condition').should('exist');
    cy.get('[class*="EntityTable_container"]').eq(4).find('thead').find('th[class="ant-table-cell"]').eq(3).contains('Inheritance').should('exist');
    cy.get('[data-row-key="0-mfrp"]').find('td[class="ant-table-cell"]').eq(0).contains('Orphanet').should('exist');
    cy.get('[data-row-key="0-mfrp"]').find('td[class="ant-table-cell"]').eq(1).contains('MFRP').should('exist');
    cy.get('[data-row-key="0-mfrp"]').find('td[class="ant-table-cell"]').eq(2).contains('Nanophthalmos').should('exist');
    cy.get('[data-row-key="0-mfrp"]').find('td[class="ant-table-cell"]').eq(3).contains('Autosomal dominant, Autosomal recessive, Not applicable').should('exist');
    cy.get('[data-row-key="2-mfrp-606227"]').find('td[class="ant-table-cell"]').eq(0).contains('OMIM').should('exist');
    cy.get('[data-row-key="2-mfrp-606227"]').find('td[class="ant-table-cell"]').eq(1).contains('MFRP (MIM:').should('exist');
    cy.get('[data-row-key="2-mfrp-606227"]').find('td[class="ant-table-cell"]').eq(2).contains('Microphthalmia, Isolated 5 (MIM:').should('exist');
    cy.get('[data-row-key="2-mfrp-606227"]').find('td[class="ant-table-cell"]').eq(3).contains('Autosomal recessive').should('exist');
    cy.get('[data-row-key="4-mfrp"]').find('td[class="ant-table-cell"]').eq(0).contains('HPO').should('exist');
    cy.get('[data-row-key="4-mfrp"]').find('td[class="ant-table-cell"]').eq(1).contains('MFRP').should('exist');
    cy.get('[data-row-key="4-mfrp"]').find('td[class="ant-table-cell"]').eq(2).contains('Microphthalmia').should('exist');
    cy.get('[data-row-key="4-mfrp"]').find('td[class="ant-table-cell"]').eq(3).contains('-').should('exist');
    cy.get('[data-row-key="6-mfrp"]').find('td[class="ant-table-cell"]').eq(0).contains('DDD').should('exist');
    cy.get('[data-row-key="6-mfrp"]').find('td[class="ant-table-cell"]').eq(1).contains('MFRP').should('exist');
    cy.get('[data-row-key="6-mfrp"]').find('td[class="ant-table-cell"]').eq(2).contains('MICROPHTHALMIA ISOLATED TYPE 5').should('exist');
    cy.get('[data-row-key="6-mfrp"]').find('td[class="ant-table-cell"]').eq(3).contains('-').should('exist');
  });
});

describe('Page d\'un variant - Valider les liens disponibles', () => {
  it('Lien Genes du panneau Summary', () => {
    cy.get('[id="summary"]').find('[class="ant-descriptions-item-content"]').eq(4).find('[href]') // data-cy="Summary_Gene_ExternalLink"
      .should('have.attr', 'href', 'https://useast.ensembl.org/Homo_sapiens/Gene/Summary?g=MFRP');
  });

  it('Lien Omim du panneau Summary', () => {
    cy.get('[id="summary"]').find('[class="ant-descriptions-item-content"]').eq(5).find('[href]') // data-cy="Summary_OMIM_ExternalLink"
    .should('have.attr', 'href', 'https://omim.org/entry/606227');
  });

  it('Lien ClinVar du panneau Summary', () => {
    cy.get('[id="summary"]').find('[class="ant-descriptions-item-content"]').eq(10).find('[href]') // data-cy="Summary_ClinVar_ExternalLink"
    .should('have.attr', 'href', 'https://www.ncbi.nlm.nih.gov/clinvar/variation/167299');
  });

  it('Lien dbSNP du panneau Summary', () => {
    cy.get('[id="summary"]').find('[class="ant-descriptions-item-content"]').eq(11).find('[href]') // data-cy="Summary_dbSNP_ExternalLink"
    .should('have.attr', 'href', 'https://www.ncbi.nlm.nih.gov/snp/rs3814762');
  });

  it('Lien du gène du panneau Gene Consequences', () => {
    cy.get('[id="consequence"]').find('div[class*="EntityGeneConsequenceSubtitle_wrapper"]').find('[href]').eq(0)
    .should('have.attr', 'href', 'https://useast.ensembl.org/Homo_sapiens/Gene/Summary?g=MFRP');
  });

  it('Lien Omim du panneau Gene Consequences', () => {
    cy.get('[id="consequence"]').find('div[class*="EntityGeneConsequenceSubtitle_wrapper"]').find('[href]').eq(1)
    .should('have.attr', 'href', 'https://omim.org/entry/606227');
  });
  
  it('Lien \'See more\' de Predictions du panneau Gene Consequences', () => {
    cy.get('[id="consequence"]').find('div[class*="EntityTable_contentTable"]').find('tr[class*="ant-table-row"]').eq(0).find('td[class*="ant-table-cell"]').eq(5).contains('See more').click({force: true});
    cy.get('[id="consequence"]').find('div[class*="EntityTable_contentTable"]').find('tr[class*="ant-table-row"]').eq(0).find('td[class*="ant-table-cell"]').eq(5).contains('Lrt').should('exist');
    cy.get('[id="consequence"]').find('div[class*="EntityTable_contentTable"]').find('tr[class*="ant-table-row"]').eq(0).find('td[class*="ant-table-cell"]').eq(5).contains('See less').click({force: true});
    cy.get('[id="consequence"]').find('div[class*="EntityTable_contentTable"]').find('tr[class*="ant-table-row"]').eq(0).find('td[class*="ant-table-cell"]').eq(5).contains('Lrt').should('not.exist');
  });

  it('Lien ENST du panneau Gene Consequences', () => {
    cy.get('[id="consequence"]').find('div[class*="EntityTable_contentTable"]').find('tr[class*="ant-table-row"]').eq(0).find('td[class="ant-table-cell"]').eq(7).find('[href]')
    .should('have.attr', 'href', 'https://www.ensembl.org/id/ENST00000619721');
  });

  it('Lien RefSeq du panneau Gene Consequences', () => {
    cy.get('[id="consequence"]').find('div[class*="EntityTable_contentTable"]').find('tr[class*="ant-table-row"]').eq(0).find('td[class="ant-table-cell"]').eq(8).find('[href]')
    .should('have.attr', 'href', 'https://www.ncbi.nlm.nih.gov/nuccore/NM_031433?report=graph');
  });

  it('Lien \'6 other transcripts\' du panneau Gene Consequences', () => {
    cy.get('[id="consequence"]').find('div[class*="EntityTable_contentTable"]').eq(0).contains('6 other transcripts +').click({force: true});
    cy.get('[id="consequence"]').find('div[class*="EntityTable_contentTable"]').eq(0).find('tr[class*="ant-table-row"]').eq(1).should('exist');
    cy.get('[id="consequence"]').find('div[class*="EntityTable_contentTable"]').eq(0).contains('Show less -').click({force: true});
    cy.get('[id="consequence"]').find('div[class*="EntityTable_contentTable"]').eq(0).find('tr[class*="ant-table-row"]').eq(1).should('not.exist');
  });

  it('Lien Studies du panneau Kids First Studies', () => {
    cy.get('[id="frequencies"]').find('tr[class*="ant-table-row"]').eq(0).find('td[class="ant-table-cell"]').eq(0).find('[href]').click({force: true});
    cy.get('[class*="Participants_participantTabWrapper"]').should('exist'); // data-cy="ProTable_Participants"
    cy.get('[class*="QueryBar_selected"]').find('[class*="QueryPill_field"]').contains('Study Code').should('exist');
    cy.get('[class*="QueryBar_selected"]').find('[class*="QueryValues_value"]').contains('KF-EATF').should('exist');
  });

  it('Lien Participants du panneau Kids First Studies [SKFP-957]', () => {
    cy.get('[id="frequencies"]').find('tr[class*="ant-table-row"]').eq(1).find('td[class="ant-table-cell"]').eq(1).find('[href]').click({force: true});
    cy.get('[class*="Participants_participantTabWrapper"]').should('exist'); // data-cy="ProTable_Participants"
    cy.get('[class*="QueryBar_selected"]').find('[class*="QueryPill_field"]').contains('Participant ID').should('exist');
    cy.get('[class*="QueryBar_selected"]').find('[class*="QueryValues_value"]').contains('PT').should('exist');
    cy.validateTableResultsCount(/^171$/);
  });

  it('Lien TopMed du panneau Public Cohort', () => {
    cy.get('[data-row-key="topmed"]').find('td[class="ant-table-cell"]').eq(0).find('[href]')
    .should('have.attr', 'href', 'https://bravo.sph.umich.edu/freeze8/hg38/variant/snv/11-119345794-C-T');
  });

  it('Lien gnomAD Genome (v3.1.2) du panneau Public Cohort', () => {
    cy.get('[data-row-key="gnomadGenomes3"]').find('td[class="ant-table-cell"]').eq(0).find('[href]')
    .should('have.attr', 'href', 'https://gnomad.broadinstitute.org/variant/11-119345794-C-T?dataset=gnomad_r3');
  });
  
  it('Lien ClinVar du panneau ClinVar', () => {
    cy.get('[id="pathogenicity"]').find('div[class="ant-collapse-header"]').find('[href]') // data-cy="Pathogenicity_ClinVar_167299_ExternalLink"
    .should('have.attr', 'href', 'https://www.ncbi.nlm.nih.gov/clinvar/variation/167299');
  });
  
  it('Lien de la condition Orphanet du panneau Gene - Phenotype', () => {
    cy.get('[data-row-key="0-mfrp"]').find('td[class="ant-table-cell"]').eq(2).find('[href]')
    .should('have.attr', 'href', 'https://www.orpha.net/consor/cgi-bin/Disease_Search.php?lng=EN&data_id=10378');
  });
  
  it('Lien OMIM du gène du panneau Gene - Phenotype', () => {
    cy.get('[data-row-key*="2-mfrp-606227"]').find('td[class="ant-table-cell"]').eq(1).find('[href]')
    .should('have.attr', 'href', 'https://www.omim.org/entry/606227');
  });
  
  it('Lien OMIM de la condition du panneau Gene - Phenotype', () => {
    cy.get('[data-row-key*="2-mfrp-606227"]').find('td[class="ant-table-cell"]').eq(2).find('[href]').first()
    .should('have.attr', 'href', 'https://www.omim.org/entry/611040');
  });
  
  it('Lien HPO de la condition du panneau Gene - Phenotype', () => {
    cy.get('[data-row-key*="4-mfrp"]').find('td[class="ant-table-cell"]').eq(2).find('[href]').eq(0)
    .should('have.attr', 'href', 'https://hpo.jax.org/app/browse/term/HP:0008323');
  });

  it('Lien \'See more\' de la condition du panneau Gene - Phenotype', () => {
    cy.get('[data-row-key="4-mfrp"]').contains('See more').click({force: true});
    cy.get('[data-row-key="4-mfrp"]').contains('Foveoschisis').should('exist');
    cy.get('[data-row-key="4-mfrp"]').contains('See less').click({force: true});
    cy.get('[data-row-key="4-mfrp"]').contains('Foveoschisis').should('not.exist');
  });
});

describe('Page d\'un variant - Valider les panneaux masquables', () => {
  it('Panneau Summary', () => {
    cy.get('[id="summary"]').find('div[class*="ant-collapse-content-active"]').should('exist');
    cy.get('[id="summary"]').find('span[class*="ant-collapse-arrow"]').click({force: true});
    cy.get('[id="summary"]').find('div[class*="ant-collapse-content-inactive ant-collapse-content-hidden"]').should('exist');
    cy.get('[id="summary"]').find('span[class*="ant-collapse-arrow"]').click({force: true});
    cy.get('[id="summary"]').find('div[class*="ant-collapse-content-active"]').should('exist');
  });

  it('Panneau Gene Consequences', () => {
    cy.get('[id="consequence"]').find('div[class*="ant-collapse-content-active"]').should('exist');
    cy.get('[id="consequence"]').find('span[class*="ant-collapse-arrow"]').click({force: true});
    cy.get('[id="consequence"]').find('div[class*="ant-collapse-content-inactive ant-collapse-content-hidden"]').should('exist');
    cy.get('[id="consequence"]').find('span[class*="ant-collapse-arrow"]').click({force: true});
    cy.get('[id="consequence"]').find('div[class*="ant-collapse-content-active"]').should('exist');
  });

  it('Panneau Kids First Studies', () => {
    cy.get('[id="frequencies"]').find('[class*="Collapse_fuiCollapse"]').find('div[class*="ant-collapse-content-active"]').should('exist');
    cy.get('[id="frequencies"]').find('[class*="Collapse_fuiCollapse"]').find('span[class*="ant-collapse-arrow"]').click({force: true});
    cy.get('[id="frequencies"]').find('[class*="Collapse_fuiCollapse"]').find('div[class*="ant-collapse-content-inactive ant-collapse-content-hidden"]').should('exist');
    cy.get('[id="frequencies"]').find('[class*="Collapse_fuiCollapse"]').find('span[class*="ant-collapse-arrow"]').click({force: true});
    cy.get('[id="frequencies"]').find('[class*="Collapse_fuiCollapse"]').find('div[class*="ant-collapse-content-active"]').should('exist');
  });

  it('Panneau Public Cohorts', () => {
    cy.get('[class*="EntityTable_container"]').eq(2).find('[class*="Collapse_fuiCollapse"]').find('div[class*="ant-collapse-content-active"]').should('exist');
    cy.get('[class*="EntityTable_container"]').eq(2).find('[class*="Collapse_fuiCollapse"]').find('span[class*="ant-collapse-arrow"]').click({force: true});
    cy.get('[class*="EntityTable_container"]').eq(2).find('[class*="Collapse_fuiCollapse"]').find('div[class*="ant-collapse-content-inactive ant-collapse-content-hidden"]').should('exist');
    cy.get('[class*="EntityTable_container"]').eq(2).find('[class*="Collapse_fuiCollapse"]').find('span[class*="ant-collapse-arrow"]').click({force: true});
    cy.get('[class*="EntityTable_container"]').eq(2).find('[class*="Collapse_fuiCollapse"]').find('div[class*="ant-collapse-content-active"]').should('exist');
  });

  it('Panneau ClinVar', () => {
    cy.get('[id="pathogenicity"]').find('[class*="Collapse_fuiCollapse"]').find('div[class*="ant-collapse-content-active"]').should('exist');
    cy.get('[id="pathogenicity"]').find('[class*="Collapse_fuiCollapse"]').find('span[class*="ant-collapse-arrow"]').click({force: true});
    cy.get('[id="pathogenicity"]').find('[class*="Collapse_fuiCollapse"]').find('div[class*="ant-collapse-content-inactive ant-collapse-content-hidden"]').should('exist');
    cy.get('[id="pathogenicity"]').find('[class*="Collapse_fuiCollapse"]').find('span[class*="ant-collapse-arrow"]').click({force: true});
    cy.get('[id="pathogenicity"]').find('[class*="Collapse_fuiCollapse"]').find('div[class*="ant-collapse-content-active"]').should('exist');
  });

  it('Panneau Gene - Phenotype', () => {
    cy.get('[class*="EntityTable_container"]').eq(4).find('[class*="Collapse_fuiCollapse"]').find('div[class*="ant-collapse-content-active"]').should('exist');
    cy.get('[class*="EntityTable_container"]').eq(4).find('[class*="Collapse_fuiCollapse"]').find('span[class*="ant-collapse-arrow"]').click({force: true});
    cy.get('[class*="EntityTable_container"]').eq(4).find('[class*="Collapse_fuiCollapse"]').find('div[class*="ant-collapse-content-inactive ant-collapse-content-hidden"]').should('exist');
    cy.get('[class*="EntityTable_container"]').eq(4).find('[class*="Collapse_fuiCollapse"]').find('span[class*="ant-collapse-arrow"]').click({force: true});
    cy.get('[class*="EntityTable_container"]').eq(4).find('[class*="Collapse_fuiCollapse"]').find('div[class*="ant-collapse-content-active"]').should('exist');
  });
});
