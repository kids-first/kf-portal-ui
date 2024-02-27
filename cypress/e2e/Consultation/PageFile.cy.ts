/// <reference types="Cypress" />
import '../../support/commands';

beforeEach(() => {
  cy.login();
  cy.visitFileEntity('GF_45BZQGS6');
});

describe('Page d\'un fichier - Valider les redirections', () => {
  it('Studies', () => {
    cy.get('a[class*="SummaryHeader_link"]').eq(0).click({force: true}); // data-cy="SummaryHeader_Studies_Button"
    cy.get('[class*="Participants_participantTabWrapper"]').should('exist'); // data-cy="ProTable_Participants"
    cy.get('[class*="QueryBar_selected"]').find('[class*="QueryPill_field"]').contains('Study Code').should('exist');
    cy.get('[class*="QueryBar_selected"]').find('[class*="QueryValues_value"]').contains('KF-CDH').should('exist');
  });
  
  it('Participant', () => {
    cy.get('a[class*="SummaryHeader_link"]').eq(1).click({force: true}); // data-cy="SummaryHeader_Participants_Button"
    cy.get('[class*="Participants_participantTabWrapper"]').should('exist'); // data-cy="ProTable_Participants"
    cy.get('[class*="QueryBar_selected"]').find('[class*="QueryPill_field"]').contains('File ID').should('exist');
    cy.get('[class*="QueryBar_selected"]').find('[class*="QueryValues_value"]').contains('GF 45BZQGS6').should('exist');
  });
  
  it('Sample', () => {
    cy.get('a[class*="SummaryHeader_link"]').eq(2).click({force: true}); // data-cy="SummaryHeader_Samples_Button"
    cy.get('[class*="Biospecimens_biospecimenTabWrapper"]').should('exist'); // data-cy="ProTable_Biospecimens"
    cy.get('[class*="QueryBar_selected"]').find('[class*="QueryPill_field"]').contains('File ID').should('exist');
    cy.get('[class*="QueryBar_selected"]').find('[class*="QueryValues_value"]').contains('GF 45BZQGS6').should('exist');
  });
});

describe('Page d\'un fichier - Vérifier les informations affichées', () => {
  it('Titre', () => {
    cy.get('[class*="EntityTitle"]').contains('GF_45BZQGS6');
  });

  it('Panneau Summary', () => {
    cy.get('a[class*="SummaryHeader_link"]').eq(0).contains(/^1$/); // data-cy="SummaryHeader_Studies_Button"
    cy.get('a[class*="SummaryHeader_link"]').eq(0).contains('Study'); // data-cy="SummaryHeader_Studies_Button"
    cy.get('a[class*="SummaryHeader_link"]').eq(1).contains(/^3$/); // data-cy="SummaryHeader_Participants_Button"
    cy.get('a[class*="SummaryHeader_link"]').eq(1).contains('Participants'); // data-cy="SummaryHeader_Participants_Button"
    cy.get('a[class*="SummaryHeader_link"]').eq(2).contains(/^3$/); // data-cy="SummaryHeader_Samples_Button"
    cy.get('a[class*="SummaryHeader_link"]').eq(2).contains('Biospecimens'); // data-cy="SummaryHeader_Samples_Button"
    cy.get('[id="summary"]').find('[class="ant-descriptions-item-label"]').eq(0).contains('ID').should('exist');
    cy.get('[id="summary"]').find('[class="ant-descriptions-item-content"]').eq(0).contains('GF_45BZQGS6').should('exist');
    cy.get('[id="summary"]').find('[class="ant-descriptions-item-label"]').eq(1).contains('Name').should('exist');
    cy.get('[id="summary"]').find('[class="ant-descriptions-item-content"]').eq(1).contains('18fa1c8f-9ac1-4608-ba5e-c79fd2331c1c.CGP.filtered.deNovo.vep.vcf.gz').should('exist');
    cy.get('[id="summary"]').find('[class="ant-descriptions-item-label"]').eq(2).contains('Study').should('exist');
    cy.get('[id="summary"]').find('[class="ant-descriptions-item-content"]').eq(2).contains('Kids First: Genomic Analysis of Congenital Diaphragmatic Hernia (KF-CDH)').should('exist');
    cy.get('[id="summary"]').find('[class="ant-descriptions-item-label"]').eq(3).contains('Format').should('exist');
    cy.get('[id="summary"]').find('[class="ant-descriptions-item-content"]').eq(3).contains(/^vcf$/).should('exist');
    cy.get('[id="summary"]').find('[class="ant-descriptions-item-content"]').eq(3).find('[class*="ColorTag_default"]').should('exist');
    cy.get('[id="summary"]').find('[class="ant-descriptions-item-label"]').eq(4).contains('Size').should('exist');
    cy.get('[id="summary"]').find('[class="ant-descriptions-item-content"]').eq(4).contains('1.03 GB').should('exist');
    cy.get('[id="summary"]').find('[class="ant-descriptions-item-label"]').eq(5).contains('URL').should('exist');
    cy.get('[id="summary"]').find('[class="ant-descriptions-item-content"]').eq(5).contains('drs://data.kidsfirstdrc.org/10197804-54a3-441a-9a64-b42e47af17b7').should('exist');
    cy.get('[id="summary"]').find('[class="ant-descriptions-item-label"]').eq(6).contains('Hash').should('exist');
    cy.get('[id="summary"]').find('[class="ant-descriptions-item-content"]').eq(6).contains('-').should('exist');
  });

  it('Panneau Data Access', () => {
    cy.get('[id="data-access"]').find('[class="ant-descriptions-item-label"]').eq(0).contains('Access').should('exist');
    cy.get('[id="data-access"]').find('[class="ant-descriptions-item-content"]').eq(0).contains('Controlled').should('exist');
    cy.get('[id="data-access"]').find('[class="ant-descriptions-item-label"]').eq(1).contains('dbGaP Accession Number').should('exist');
    cy.get('[id="data-access"]').find('[class="ant-descriptions-item-content"]').eq(1).contains('phs001110').should('exist');
    cy.get('[id="data-access"]').find('[class="ant-descriptions-item-label"]').eq(2).contains('Consent Codes').should('exist');
    cy.get('[id="data-access"]').find('[class="ant-descriptions-item-content"]').eq(2).contains('phs001110.c1').should('exist');
  });

  it('Panneau Data Type', () => {
    cy.get('[id="data-type"]').find('[class="ant-descriptions-item-label"]').eq(0).contains('Category').should('exist');
    cy.get('[id="data-type"]').find('[class="ant-descriptions-item-content"]').eq(0).contains('Genomics').should('exist');
    cy.get('[id="data-type"]').find('[class="ant-descriptions-item-label"]').eq(1).contains('Type').should('exist');
    cy.get('[id="data-type"]').find('[class="ant-descriptions-item-content"]').eq(1).contains('Variant Calls').should('exist');
    cy.get('[id="data-type"]').find('[class="ant-descriptions-item-label"]').eq(2).contains('Harmonized Data').should('exist');
    cy.get('[id="data-type"]').find('[class="ant-descriptions-item-content"]').eq(2).contains('No').should('exist');
  });

  it('Panneau Participants-Samples', () => {
    cy.resetColumns('participant-sample');
    cy.showColumn('Collection ID');
    cy.showColumn('External Participant ID');
    cy.get('[id="participant-sample"]').find('[class="ant-collapse-header"]').contains('(3)').should('exist');
    cy.get('[id="participant-sample"]').find('[class="ant-collapse-header"]').contains('View in data exploration').should('exist');
    cy.get('[id="participant-sample"]').find('[class="ant-collapse-header"]').find('svg[class="anticon"]').should('exist');
    cy.get('[id="participant-sample"]').find('thead').find('th[class="ant-table-cell"]').eq(0).contains('Participant ID').should('exist');
    cy.get('[id="participant-sample"]').find('thead').find('th[class="ant-table-cell"]').eq(1).contains('Study').should('exist');
    cy.get('[id="participant-sample"]').find('thead').find('th[class="ant-table-cell"]').eq(2).contains('Proband').should('exist');
    cy.get('[id="participant-sample"]').find('thead').find('th[class="ant-table-cell"]').eq(3).contains('Sample ID').should('exist');
    cy.get('[id="participant-sample"]').find('thead').find('th[class="ant-table-cell"]').eq(4).contains('Sample Type').should('exist');
    cy.get('[id="participant-sample"]').find('thead').find('th[class="ant-table-cell"]').eq(5).contains('Collection Sample Type').should('exist');
    cy.get('[id="participant-sample"]').find('thead').find('th[class="ant-table-cell"]').eq(6).contains('Collection ID').should('exist');
    cy.get('[id="participant-sample"]').find('thead').find('th[class="ant-table-cell"]').eq(7).contains('External Participant ID').should('exist');
    cy.get('[data-row-key="BS_VMV9N2KK"]').find('td[class="ant-table-cell"]').eq(0).contains('PT_1DYA8779').should('exist');
    cy.get('[data-row-key="BS_VMV9N2KK"]').find('td[class="ant-table-cell"]').eq(1).contains('KF-CDH').should('exist');
    cy.get('[data-row-key="BS_VMV9N2KK"]').find('td[class="ant-table-cell"]').eq(2).contains('No').should('exist');
    cy.get('[data-row-key="BS_VMV9N2KK"]').find('td[class="ant-table-cell"]').eq(3).contains('BS_VMV9N2KK').should('exist');
    cy.get('[data-row-key="BS_VMV9N2KK"]').find('td[class="ant-table-cell"]').eq(4).contains('DNA').should('exist');
    cy.get('[data-row-key="BS_VMV9N2KK"]').find('td[class="ant-table-cell"]').eq(5).contains('-').should('exist');
    cy.get('[data-row-key="BS_VMV9N2KK"]').find('td[class="ant-table-cell"]').eq(6).contains('BS_VMV9N2KK_Leukocyte').should('exist');
    cy.get('[data-row-key="BS_VMV9N2KK"]').find('td[class="ant-table-cell"]').eq(7).contains('667').should('exist');
  });

  it('Panneau Experimental Procedure', () => {
    cy.resetColumns('experimental-procedure');
    cy.get('[id="experimental-procedure"]').find('thead').find('th[class="ant-table-cell"]').eq(0).contains('Experimental Strategy').should('exist');
    cy.get('[id="experimental-procedure"]').find('thead').find('th[class="ant-table-cell"]').eq(1).contains('Platform').should('exist');
    cy.get('[id="experimental-procedure"]').find('thead').find('th[class="ant-table-cell"]').eq(2).contains('Instrument Model').should('exist');
    cy.get('[id="experimental-procedure"]').find('thead').find('th[class="ant-table-cell"]').eq(3).contains('Library Strand').should('exist');
    cy.get('[id="experimental-procedure"]').find('thead').find('th[class="ant-table-cell"]').eq(4).contains('Library Name').should('exist');
    cy.get('[id="experimental-procedure"]').find('thead').find('th[class="ant-table-cell"]').eq(5).contains('Experiment Date').should('exist');
    cy.get('[id="experimental-procedure"]').find('thead').find('th[class="ant-table-cell"]').eq(6).contains('Sequencing Center ID').should('exist');
    cy.get('[data-row-key="SE_X9RPH18C"]').find('td[class="ant-table-cell"]').eq(0).contains('WGS').should('exist');
    cy.get('[data-row-key="SE_X9RPH18C"]').find('td[class="ant-table-cell"]').eq(1).contains('Not Reported').should('exist');
    cy.get('[data-row-key="SE_X9RPH18C"]').find('td[class="ant-table-cell"]').eq(2).contains('HiSeq X Ten').should('exist');
    cy.get('[data-row-key="SE_X9RPH18C"]').find('td[class="ant-table-cell"]').eq(3).contains('Not Reported').should('exist');
    cy.get('[data-row-key="SE_X9RPH18C"]').find('td[class="ant-table-cell"]').eq(4).contains('IWG_IND-GMKFWC.CDH667-1_2pA').should('exist');
    cy.get('[data-row-key="SE_X9RPH18C"]').find('td[class="ant-table-cell"]').eq(5).contains('2016-01-26T00:00:00+00:00').should('exist');
    cy.get('[data-row-key="SE_X9RPH18C"]').find('td[class="ant-table-cell"]').eq(6).contains('IWG_IND-GMKFWC.CDH667-1_2pA').should('exist');
  });
});

describe('Page d\'un fichier - Valider les liens disponibles', () => {
  it('Lien dbGaP Accession Number du panneau Data Access', () => {
    cy.get('[id="data-access"]').find('[class="ant-descriptions-item-content"]').eq(1).find('[href]')
      .should('have.attr', 'href', 'https://www.ncbi.nlm.nih.gov/projects/gap/cgi-bin/study.cgi?study_id=phs001110');
  });

  it('Lien DataExploration du panneau Participants-Samples', () => {
    cy.get('[id="participant-sample"] a[class*="EntityTableRedirectLink"]').click({force: true}); // data-cy="Participants_RedirectLink"
    cy.get('[class*="Participants_participantTabWrapper"]').should('exist'); // data-cy="ProTable_Participants"
    cy.get('[class*="QueryBar_selected"]').find('[class*="QueryPill_field"]').contains('File ID').should('exist');
    cy.get('[class*="QueryBar_selected"]').find('[class*="QueryValues_value"]').contains('GF 45BZQGS6').should('exist');
  });

  it('Lien Participant ID du panneau Participants-Samples', () => {
    cy.resetColumns('participant-sample');
    cy.get('[data-row-key="BS_VMV9N2KK"]').find('td[class="ant-table-cell"]').eq(0).find('[href]').click({force: true});
    cy.get('[id="participant-entity-page"]').should('exist');
    cy.get('[class*="EntityTitle"]').contains('PT_1DYA8779');
  });
});

describe('Page d\'un fichier - Valider les panneaux masquables', () => {
  it('Panneau Summary', () => {
    cy.get('[id="summary"]').find('div[class*="ant-collapse-content-active"]').should('exist');
    cy.get('[id="summary"]').find('span[class*="ant-collapse-arrow"]').click({force: true});
    cy.get('[id="summary"]').find('div[class*="ant-collapse-content-inactive ant-collapse-content-hidden"]').should('exist');
    cy.get('[id="summary"]').find('span[class*="ant-collapse-arrow"]').click({force: true});
    cy.get('[id="summary"]').find('div[class*="ant-collapse-content-active"]').should('exist');
  });

  it('Panneau Data Access', () => {
    cy.get('[id="data-access"]').find('div[class*="ant-collapse-content-active"]').should('exist');
    cy.get('[id="data-access"]').find('span[class*="ant-collapse-arrow"]').click({force: true});
    cy.get('[id="data-access"]').find('div[class*="ant-collapse-content-inactive ant-collapse-content-hidden"]').should('exist');
    cy.get('[id="data-access"]').find('span[class*="ant-collapse-arrow"]').click({force: true});
    cy.get('[id="data-access"]').find('div[class*="ant-collapse-content-active"]').should('exist');
  });

  it('Panneau Data Type', () => {
    cy.get('[id="data-type"]').find('div[class*="ant-collapse-content-active"]').should('exist');
    cy.get('[id="data-type"]').find('span[class*="ant-collapse-arrow"]').click({force: true});
    cy.get('[id="data-type"]').find('div[class*="ant-collapse-content-inactive ant-collapse-content-hidden"]').should('exist');
    cy.get('[id="data-type"]').find('span[class*="ant-collapse-arrow"]').click({force: true});
    cy.get('[id="data-type"]').find('div[class*="ant-collapse-content-active"]').should('exist');
  });

  it('Panneau Participants-Samples', () => {
    cy.get('[id="participant-sample"]').find('div[class*="ant-collapse-content-active"]').should('exist');
    cy.get('[id="participant-sample"]').find('span[class*="ant-collapse-arrow"]').click({force: true});
    cy.get('[id="participant-sample"]').find('div[class*="ant-collapse-content-inactive ant-collapse-content-hidden"]').should('exist');
    cy.get('[id="participant-sample"]').find('span[class*="ant-collapse-arrow"]').click({force: true});
    cy.get('[id="participant-sample"]').find('div[class*="ant-collapse-content-active"]').should('exist');
  });

  it('Panneau Experimental Procedure', () => {
    cy.get('[id="experimental-procedure"]').find('div[class*="ant-collapse-content-active"]').should('exist');
    cy.get('[id="experimental-procedure"]').find('span[class*="ant-collapse-arrow"]').click({force: true});
    cy.get('[id="experimental-procedure"]').find('div[class*="ant-collapse-content-inactive ant-collapse-content-hidden"]').should('exist');
    cy.get('[id="experimental-procedure"]').find('span[class*="ant-collapse-arrow"]').click({force: true});
    cy.get('[id="experimental-procedure"]').find('div[class*="ant-collapse-content-active"]').should('exist');
  });
});
