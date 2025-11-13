/// <reference types="cypress"/>
import '../../support/commands';

beforeEach(() => {
  cy.login();
  cy.visitVariantEntityPage('1-156176849-G-A', 1);
});

describe('Page d\'un variant - Valider les liens disponibles', () => {
  it('Lien View somatic du Titre', () => {
    cy.get('[class*="EntityTitle"] [class*="VariantEntity_somaticLink"]').clickAndWait({force: true});
    cy.get('[class*="VariantsTable_variantTabWrapper"]').should('exist');
    cy.get('[class*="QueryBar_selected"] [class*="QueryPill_field"]').contains('Variant ID').should('exist');
    cy.get('[class*="QueryBar_selected"] [class*="QueryValues_value"]').contains('1-156176849-G-A').should('exist');
  });
  
  it('Lien Gene du panneau Summary', () => {
    // data-cy="Summary_Gene_ExternalLink"
    cy.get('a[class*="VariantEntity_symbolLink"]').eq(0).should('have.attr', 'href', 'https://omim.org/entry/607292');
  });

  it('Lien Ensembl du panneau Summary', () => {
    // data-cy="Summary_Ensembl_ExternalLink"
    cy.get('a[class*="VariantEntity_ensemblLink"]').eq(0).should('have.attr', 'href', 'https://www.ensembl.org/id/ENSG00000196189');
  });

  it('Lien ClinVar du panneau Summary', () => {
    cy.get('div[class*="EntityVariantSummary_bannerWrapper"] [class="ant-space-item"]').eq(7).find('[class*="ant-tag-green"] a') // data-cy="Summary_ClinVar_ExternalLink"
    .should('have.attr', 'href', 'https://www.ncbi.nlm.nih.gov/clinvar/variation/3362');
  });

  it('Lien Participants du panneau Summary', () => {
    cy.get('div[class*="EntityVariantSummary_bannerWrapper"] [class="ant-space-item"]').eq(11).find('a').clickAndWait({force: true});
    cy.get('[class*="Participants_participantTabWrapper"]').should('exist'); // data-cy="ProTable_Participants"
    cy.get('[class*="QueryBar_selected"] [class*="QueryPill_field"]').contains('Participant ID').should('exist');
    cy.get('[class*="QueryBar_selected"] [class*="QueryValues_value"]').contains('PT').should('exist');
    cy.validateTableResultsCount(/^145$/);
  });

  it('Lien gnomAD du panneau Summary', () => {
    cy.get('div[class*="EntityVariantSummary_bannerWrapper"] [class="ant-space-item"]').eq(13).find('a') // data-cy="Summary_gnomAD_ExternalLink"
    .should('have.attr', 'href', 'https://gnomad.broadinstitute.org/variant/1-156176849-G-A?dataset=gnomad_r3');
  });

  it('Lien Ensembl Transcript du panneau Summary', () => {
    cy.get('div[class*="EntityVariantSummary_infoWrapper"] div[class*="ant-space-item"]').eq(0).find('a') // data-cy="Summary_Ensembl_Transcript_ExternalLink"
    .should('have.attr', 'href', 'https://www.ensembl.org/id/ENST00000368285');
  });

  it('Lien RefSeq du panneau Summary', () => {
    cy.get('div[class*="EntityVariantSummary_infoWrapper"] a').eq(1) // data-cy="Summary_RefSeq_ExternalLink"
    .should('have.attr', 'href', 'https://www.ncbi.nlm.nih.gov/nuccore/NM_001193300.2?report=graph');
  });

  it('Popover \'See more\' du RefSeq du panneau Summary', () => {
    cy.get('div[class*="EntityVariantSummary_infoWrapper"] button').clickAndWait({force: true});
    cy.get('[class="ant-popover-title"]').contains('RefSeq - ENST00000368285').should('exist');
    cy.get('[class="ant-popover-inner-content"] a')
    .should('have.attr', 'href', 'https://www.ncbi.nlm.nih.gov/nuccore/NM_022367.4?report=graph')
    .contains('NM_022367.4').should('exist');
  });

  it('Lien dbSNP du panneau Summary', () => {
    cy.get('div[class*="EntityVariantSummary_infoWrapper"] a').eq(2) // data-cy="Summary_sbSNP_ExternalLink"
    .should('have.attr', 'href', 'https://www.ncbi.nlm.nih.gov/snp/rs41265017');
  });

  it('Lien OMIM du panneau Summary', () => {
    cy.get('div[class*="EntityVariantSummary_omim"] [class="ant-descriptions-item-label"] a') // data-cy="Summary_Omim_ExternalLink"
    .should('have.attr', 'href', 'https://www.omim.org/entry/610282');
  });

  it('Ouvrir et refermer la nested table du panneau Transcripts', () => {
    cy.get('[id="consequence"] tbody td[class*="ant-table-row-expand-icon-cell"]').eq(0).find('button').clickAndWait({force: true});
    cy.get('[id="consequence"] tr[class*="ant-table-expanded-row"]').eq(0).should('have.css', 'display', 'table-row');
    cy.get('[id="consequence"] tbody td[class*="ant-table-row-expand-icon-cell"]').eq(0).find('button').clickAndWait({force: true});
    cy.get('[id="consequence"] tr[class*="ant-table-expanded-row"]').eq(0).should('have.css', 'display', 'none');
  });

  it('Lien du gène du panneau Transcripts', () => {
    cy.get('[id="consequence"] tbody td[class="ant-table-cell"]').eq(0).find('[href]').eq(0).should('have.attr', 'href', 'https://www.omim.org/entry/607292');
  });

  it('Lien \'See more\' de Prediction du panneau Transcripts', () => {
    cy.get('[id="consequence"] tbody td[class*="ant-table-row-expand-icon-cell"]').eq(0).find('button').clickAndWait({force: true});
    cy.get('[id="consequence"] div[class*="VariantEntity_expandedTable"] tbody td[class*="ant-table-cell"]').eq(3).find('[class*="ExpandableCell_fuiExpandableCellBtn"]').contains('See more').clickAndWait({force: true});
    cy.get('[id="consequence"] div[class*="VariantEntity_expandedTable"] tbody td[class*="ant-table-cell"]').eq(3).find('span[class*="ant-typography"]').eq(4).contains('CADD (Raw)').should('exist');
    cy.get('[id="consequence"] div[class*="VariantEntity_expandedTable"] tbody td[class*="ant-table-cell"]').eq(3).find('span[class*="ant-typography"]').eq(5).contains('2.591949').should('exist');
    cy.get('[id="consequence"] div[class*="VariantEntity_expandedTable"] tbody td[class*="ant-table-cell"]').eq(3).find('span[class*="ant-typography"]').eq(6).contains('CADD (Phred)').should('exist');
    cy.get('[id="consequence"] div[class*="VariantEntity_expandedTable"] tbody td[class*="ant-table-cell"]').eq(3).find('span[class*="ant-typography"]').eq(7).contains('22.6').should('exist');
    cy.get('[id="consequence"] div[class*="VariantEntity_expandedTable"] tbody td[class*="ant-table-cell"]').eq(3).find('span[class*="ant-typography"]').eq(8).contains('DANN').should('exist');
    cy.get('[id="consequence"] div[class*="VariantEntity_expandedTable"] tbody td[class*="ant-table-cell"]').eq(3).find('span[class*="ant-typography"]').eq(9).contains('0.9805721474226299').should('exist');
    cy.get('[id="consequence"] div[class*="VariantEntity_expandedTable"] tbody td[class*="ant-table-cell"]').eq(3).find('span[class*="ant-typography"]').eq(10).contains('LRT').should('exist');
    cy.get('[id="consequence"] div[class*="VariantEntity_expandedTable"] tbody td[class*="ant-table-cell"]').eq(3).find('span[class*="ant-typography"]').eq(11).contains('Neutral').should('exist');
    cy.get('[id="consequence"] div[class*="VariantEntity_expandedTable"] tbody td[class*="ant-table-cell"]').eq(3).find('span[class*="ant-typography"]').eq(11).contains('0.52363').should('exist');
    cy.get('[id="consequence"] div[class*="VariantEntity_expandedTable"] tbody td[class*="ant-table-cell"]').eq(3).find('span[class*="ant-typography"]').eq(12).contains('REVEL').should('exist');
    cy.get('[id="consequence"] div[class*="VariantEntity_expandedTable"] tbody td[class*="ant-table-cell"]').eq(3).find('span[class*="ant-typography"]').eq(13).contains('0.238').should('exist');
    cy.get('[id="consequence"] div[class*="VariantEntity_expandedTable"] tbody td[class*="ant-table-cell"]').eq(3).find('span[class*="ant-typography"]').eq(14).contains('PolyPhen-2 HVAR').should('exist');
    cy.get('[id="consequence"] div[class*="VariantEntity_expandedTable"] tbody td[class*="ant-table-cell"]').eq(3).find('span[class*="ant-typography"]').eq(15).contains('Benign').should('exist');
    cy.get('[id="consequence"] div[class*="VariantEntity_expandedTable"] tbody td[class*="ant-table-cell"]').eq(3).find('span[class*="ant-typography"]').eq(15).contains('0.024').should('exist');
    cy.get('[id="consequence"] div[class*="VariantEntity_expandedTable"] tbody td[class*="ant-table-cell"]').eq(3).find('[class*="ExpandableCell_fuiExpandableCellBtn"]').contains('See less').clickAndWait({force: true});
    cy.get('[id="consequence"] div[class*="VariantEntity_expandedTable"] tbody td[class*="ant-table-cell"]').eq(3).find('span[class*="ant-typography"]').eq(4).should('not.exist');
  });
  
  it('Lien du transcript du panneau Transcripts', () => {
    cy.get('[id="consequence"] tbody td[class*="ant-table-row-expand-icon-cell"]').eq(0).find('button').clickAndWait({force: true});
    cy.get('[id="consequence"] div[class*="VariantEntity_expandedTable"] tbody td[class*="ant-table-cell"]').eq(5).find('a').should('have.attr', 'href', 'https://www.ensembl.org/id/ENST00000368285');
  });

  it('Lien du RefSeq du panneau Transcripts', () => {
    cy.get('[id="consequence"] tbody td[class*="ant-table-row-expand-icon-cell"]').eq(0).find('button').clickAndWait({force: true});
    cy.get('[id="consequence"] div[class*="VariantEntity_expandedTable"] tbody td[class*="ant-table-cell"]').eq(6).find('a').should('have.attr', 'href', 'https://www.ncbi.nlm.nih.gov/nuccore/NM_001193300.2?report=graph');
  });

  it('Lien \'See more\' de RefSeq du panneau Transcripts', () => {
    cy.get('[id="consequence"] tbody td[class*="ant-table-row-expand-icon-cell"]').eq(0).find('button').clickAndWait({force: true});
    cy.get('[id="consequence"] div[class*="VariantEntity_expandedTable"] tbody td[class*="ant-table-cell"]').eq(6).find('[class*="ExpandableCell_fuiExpandableCellBtn"]').contains('See more').clickAndWait({force: true});
    cy.get('[id="consequence"] div[class*="VariantEntity_expandedTable"] tbody td[class*="ant-table-cell"]').eq(6).find('[class*="ant-space-item"]').eq(1).contains('NM_022367.4').should('exist');
    cy.get('[id="consequence"] div[class*="VariantEntity_expandedTable"] tbody td[class*="ant-table-cell"]').eq(6).find('[class*="ExpandableCell_fuiExpandableCellBtn"]').contains('See less').clickAndWait({force: true});
    cy.get('[id="consequence"] div[class*="VariantEntity_expandedTable"] tbody td[class*="ant-table-cell"]').eq(6).find('[class*="ant-space-item"]').eq(1).should('not.exist');
  });

  it('Lien Studies du panneau Kids First Studies', () => {
    cy.get('[id="frequency"] tr[class*="ant-table-row"]').eq(0).find('td[class="ant-table-cell"]').eq(0).find('a').clickAndWait({force: true});
    cy.get('[class*="Participants_participantTabWrapper"]').should('exist'); // data-cy="ProTable_Participants"
    cy.get('[class*="QueryBar_selected"] [class*="QueryPill_field"]').contains('Study Code').should('exist');
    cy.get('[class*="QueryBar_selected"] [class*="QueryValues_value"]').contains(/(KF-EATF|KF-NBL)/).should('exist');
  });

  it('Lien Participants du panneau Kids First Studies', () => {
    cy.get('[id="frequency"] tr[class*="ant-table-row"]').eq(0).find('td[class="ant-table-cell"]').eq(1).find('a').clickAndWait({force: true});
    cy.get('[class*="Participants_participantTabWrapper"]').should('exist'); // data-cy="ProTable_Participants"
    cy.get('[class*="QueryBar_selected"] [class*="QueryPill_field"]').contains('Participant ID').should('exist');
    cy.get('[class*="QueryBar_selected"] [class*="QueryValues_value"]').contains('PT').should('exist');
    cy.validateTableResultsCount(/^(29|116)$/);
  });

  it('Lien TopMed du panneau Public Cohorts', () => {
    cy.get('[data-row-key="topmed"] td[class="ant-table-cell"]').eq(0).find('[href]')
    .should('have.attr', 'href', 'https://bravo.sph.umich.edu/freeze8/hg38/variant/snv/1-156176849-G-A');
  });

  it('Lien gnomAD Genome (v3.1.2) du panneau Public Cohorts', () => {
    cy.get('[data-row-key="gnomadGenomes3"] td[class="ant-table-cell"]').eq(0).find('[href]')
    .should('have.attr', 'href', 'https://gnomad.broadinstitute.org/variant/1-156176849-G-A?dataset=gnomad_r3');
  });

  it('Lien de la condition Orphanet du panneau Gene - Phenotype Association', () => {
    cy.get('[data-row-key="0-s-e-m-a-4-a"] td[class="ant-table-cell"]').eq(2).find('[href]')
    .should('have.attr', 'href', 'https://www.orpha.net/consor/cgi-bin/Disease_Search.php?lng=EN&data_id=23409');
  });

  it('Lien OMIM du gène du panneau Gene - Phenotype Association', () => {
    cy.get('[data-row-key*="1-s-e-m-a-4-a-607292"] td[class="ant-table-cell"]').eq(1).find('[href]')
    .should('have.attr', 'href', 'https://www.omim.org/entry/607292');
  });

  it('Lien OMIM de la condition du panneau Gene - Phenotype Association', () => {
    cy.get('[data-row-key*="1-s-e-m-a-4-a-607292"] td[class="ant-table-cell"]').eq(2).find('[href]').first()
    .should('have.attr', 'href', 'https://www.omim.org/entry/610282');
  });

  it('Lien HPO de la condition du panneau Gene - Phenotype Association', () => {
    cy.get('[data-row-key*="2-s-e-m-a-4-a"] td[class="ant-table-cell"]').eq(2).find('[href]').eq(0)
    .should('have.attr', 'href', 'https://hpo.jax.org/app/browse/term/HP:0000518');
  });

  it('Lien \'See more\' de la condition du panneau Gene - Phenotype Association', () => {
    cy.get('[data-row-key="2-s-e-m-a-4-a"]').contains('See more').clickAndWait({force: true});
    cy.get('[data-row-key="2-s-e-m-a-4-a"]').contains('Flexion Contracture').should('exist');
    cy.get('[data-row-key="2-s-e-m-a-4-a"]').contains('See less').clickAndWait({force: true});
    cy.get('[data-row-key="2-s-e-m-a-4-a"]').contains('Flexion Contracture').should('not.exist');
  });
});
