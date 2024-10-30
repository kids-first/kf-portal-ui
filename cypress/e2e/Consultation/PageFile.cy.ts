/// <reference types="cypress"/>
import '../../support/commands';

beforeEach(() => {
  cy.login();
  cy.visitFileEntity('GF_6DVS70V9');
});

describe('Page d\'un fichier - Valider les redirections', () => {
  it('Studies', () => {
    cy.get('a[class*="SummaryHeader_link"]').eq(0).clickAndWait({force: true}); // data-cy="SummaryHeader_Studies_Button"
    cy.get('[class*="Participants_participantTabWrapper"]').should('exist'); // data-cy="ProTable_Participants"
    cy.get('[class*="QueryBar_selected"] [class*="QueryPill_field"]').contains('Study Code').should('exist');
    cy.get('[class*="QueryBar_selected"] [class*="QueryValues_value"]').contains('KF-CDH').should('exist');
  });
  
  it('Participant', () => {
    cy.get('a[class*="SummaryHeader_link"]').eq(1).clickAndWait({force: true}); // data-cy="SummaryHeader_Participants_Button"
    cy.get('[class*="Participants_participantTabWrapper"]').should('exist'); // data-cy="ProTable_Participants"
    cy.get('[class*="QueryBar_selected"] [class*="QueryPill_field"]').contains('File ID').should('exist');
    cy.get('[class*="QueryBar_selected"] [class*="QueryValues_value"]').contains('GF 6DVS70V9').should('exist');
  });
  
  it('Sample', () => {
    cy.get('a[class*="SummaryHeader_link"]').eq(2).clickAndWait({force: true}); // data-cy="SummaryHeader_Samples_Button"
    cy.get('[class*="Biospecimens_biospecimenTabWrapper"]').should('exist'); // data-cy="ProTable_Biospecimens"
    cy.get('[class*="QueryBar_selected"] [class*="QueryPill_field"]').contains('File ID').should('exist');
    cy.get('[class*="QueryBar_selected"] [class*="QueryValues_value"]').contains('GF 6DVS70V9').should('exist');
  });
});

describe('Page d\'un fichier - Vérifier les informations affichées', () => {
  it('Titre', () => {
    cy.get('[class*="EntityTitle"]').contains('GF_6DVS70V9');
  });

  it('Panneau Summary [SKFP-1334]', () => {
    cy.get('a[class*="SummaryHeader_link"]').eq(0).contains(/^1$/); // data-cy="SummaryHeader_Studies_Button"
    cy.get('a[class*="SummaryHeader_link"]').eq(0).contains('Study'); // data-cy="SummaryHeader_Studies_Button"
    cy.get('a[class*="SummaryHeader_link"]').eq(1).contains(/^3$/); // data-cy="SummaryHeader_Participants_Button"
    cy.get('a[class*="SummaryHeader_link"]').eq(1).contains('Participants'); // data-cy="SummaryHeader_Participants_Button"
    cy.get('a[class*="SummaryHeader_link"]').eq(2).contains(/^3$/); // data-cy="SummaryHeader_Samples_Button"
    cy.get('a[class*="SummaryHeader_link"]').eq(2).contains('Biospecimens'); // data-cy="SummaryHeader_Samples_Button"
    cy.get('[id="summary"] [class="ant-descriptions-item-label"]').eq(0).contains('ID').should('exist');
    cy.get('[id="summary"] [class="ant-descriptions-item-content"]').eq(0).contains('GF_6DVS70V9').should('exist');
    cy.get('[id="summary"] [class="ant-descriptions-item-label"]').eq(1).contains('Name').should('exist');
    cy.get('[id="summary"] [class="ant-descriptions-item-content"]').eq(1).contains('2882b453-28b8-4238-bf7a-c4e0ff015a28.multi.vqsr.filtered.denovo.vep_105.vcf.gz').should('exist');
    cy.get('[id="summary"] [class="ant-descriptions-item-label"]').eq(2).contains('Study').should('exist');
    cy.get('[id="summary"] [class="ant-descriptions-item-content"]').eq(2).contains('Kids First: Genomic Analysis of Congenital Diaphragmatic Hernia (KF-CDH)').should('exist');
    cy.get('[id="summary"] [class="ant-descriptions-item-label"]').eq(3).contains('Format').should('exist');
    cy.get('[id="summary"] [class="ant-descriptions-item-content"]').eq(3).contains(/^vcf$/).should('exist');
    cy.get('[id="summary"] [class="ant-descriptions-item-content"]').eq(3).find('[class*="ColorTag_default"]').should('exist');
    cy.get('[id="summary"] [class="ant-descriptions-item-label"]').eq(4).contains('Size').should('exist');
    cy.get('[id="summary"] [class="ant-descriptions-item-content"]').eq(4).contains('3.04 GB').should('exist');
    cy.get('[id="summary"] [class="ant-descriptions-item-label"]').eq(5).contains('URL').should('exist');
    cy.get('[id="summary"] [class="ant-descriptions-item-content"]').eq(5).contains('drs://data.kidsfirstdrc.org/37cdb370-cda3-4504-be1b-f59cf6f785de').should('exist');
    cy.get('[id="summary"] [class="ant-descriptions-item-label"]').eq(6).contains('Hash').should('exist');
    cy.get('[id="summary"] [class="ant-descriptions-item-content"]').eq(6).contains('03322135eecaa16253565aa8b2bed532-12').should('exist');
  });

  it('Panneau Data Access', () => {
    cy.get('[id="data-access"] [class="ant-descriptions-item-label"]').eq(0).contains('Access').should('exist');
    cy.get('[id="data-access"] [class="ant-descriptions-item-content"]').eq(0).contains('Controlled').should('exist');
    cy.get('[id="data-access"] [class="ant-descriptions-item-label"]').eq(1).contains('dbGaP Accession Number').should('exist');
    cy.get('[id="data-access"] [class="ant-descriptions-item-content"]').eq(1).contains('phs001110').should('exist');
    cy.get('[id="data-access"] [class="ant-descriptions-item-label"]').eq(2).contains('Consent Codes').should('exist');
    cy.get('[id="data-access"] [class="ant-descriptions-item-content"]').eq(2).contains('phs001110.c1').should('exist');
  });

  it('Panneau Data Type', () => {
    cy.get('[id="data-type"] [class="ant-descriptions-item-label"]').eq(0).contains('Category').should('exist');
    cy.get('[id="data-type"] [class="ant-descriptions-item-content"]').eq(0).contains('Genomics').should('exist');
    cy.get('[id="data-type"] [class="ant-descriptions-item-label"]').eq(1).contains('Type').should('exist');
    cy.get('[id="data-type"] [class="ant-descriptions-item-content"]').eq(1).contains('Simple Nucleotide Variations').should('exist');
    cy.get('[id="data-type"] [class="ant-descriptions-item-label"]').eq(2).contains('Harmonized Data').should('exist');
    cy.get('[id="data-type"] [class="ant-descriptions-item-content"]').eq(2).contains('No').should('exist');
  });

  it('Panneau Participants-Samples', () => {
    cy.resetColumns('participant-sample');
    cy.showColumn('Collection ID');
    cy.showColumn('External Participant ID');
    cy.get('[id="participant-sample"] [class="ant-collapse-header"]').contains('(3)').should('exist');
    cy.get('[id="participant-sample"] [class="ant-collapse-header"]').contains('View in exploration').should('exist');
    cy.get('[id="participant-sample"] [class="ant-collapse-header"] svg[class="anticon"]').should('exist');
    cy.get('[id="participant-sample"] thead th[class="ant-table-cell"]').eq(0).contains('Participant ID').should('exist');
    cy.get('[id="participant-sample"] thead th[class="ant-table-cell"]').eq(1).contains('Study').should('exist');
    cy.get('[id="participant-sample"] thead th[class="ant-table-cell"]').eq(2).contains('Proband').should('exist');
    cy.get('[id="participant-sample"] thead th[class="ant-table-cell"]').eq(3).contains('Sample ID').should('exist');
    cy.get('[id="participant-sample"] thead th[class="ant-table-cell"]').eq(4).contains('Sample Type').should('exist');
    cy.get('[id="participant-sample"] thead th[class="ant-table-cell"]').eq(5).contains('Collection Sample Type').should('exist');
    cy.get('[id="participant-sample"] thead th[class="ant-table-cell"]').eq(6).contains('Collection ID').should('exist');
    cy.get('[id="participant-sample"] thead th[class="ant-table-cell"]').eq(7).contains('External Participant ID').should('exist');
    cy.get('[data-row-key="BS_VMV9N2KK"] td[class="ant-table-cell"]').eq(0).contains('PT_1DYA8779').should('exist');
    cy.get('[data-row-key="BS_VMV9N2KK"] td[class="ant-table-cell"]').eq(1).contains('KF-CDH').should('exist');
    cy.get('[data-row-key="BS_VMV9N2KK"] td[class="ant-table-cell"]').eq(2).contains('No').should('exist');
    cy.get('[data-row-key="BS_VMV9N2KK"] td[class="ant-table-cell"]').eq(3).contains('BS_VMV9N2KK').should('exist');
    cy.get('[data-row-key="BS_VMV9N2KK"] td[class="ant-table-cell"]').eq(4).contains('DNA').should('exist');
    cy.get('[data-row-key="BS_VMV9N2KK"] td[class="ant-table-cell"]').eq(5).contains('Leukocyte').should('exist');
    cy.get('[data-row-key="BS_VMV9N2KK"] td[class="ant-table-cell"]').eq(6).contains('SA_3RKYWRX4').should('exist');
    cy.get('[data-row-key="BS_VMV9N2KK"] td[class="ant-table-cell"]').eq(7).contains('667').should('exist');
  });

  it('Panneau Experimental Procedure', () => {
    cy.resetColumns('experimental-procedure');
    cy.get('[id="experimental-procedure"] thead th[class="ant-table-cell"]').eq(0).contains('Experimental Strategy').should('exist');
    cy.get('[id="experimental-procedure"] thead th[class="ant-table-cell"]').eq(1).contains('Platform').should('exist');
    cy.get('[id="experimental-procedure"] thead th[class="ant-table-cell"]').eq(2).contains('Instrument Model').should('exist');
    cy.get('[id="experimental-procedure"] thead th[class="ant-table-cell"]').eq(3).contains('Library Strand').should('exist');
    cy.get('[id="experimental-procedure"] thead th[class="ant-table-cell"]').eq(4).contains('Library Name').should('exist');
    cy.get('[id="experimental-procedure"] thead th[class="ant-table-cell"]').eq(5).contains('Experiment Date').should('exist');
    cy.get('[id="experimental-procedure"] thead th[class="ant-table-cell"]').eq(6).contains('Sequencing Center ID').should('exist');
    cy.get('[data-row-key="SE_X9RPH18C"] td[class="ant-table-cell"]').eq(0).contains('WGS').should('exist');
    cy.get('[data-row-key="SE_X9RPH18C"] td[class="ant-table-cell"]').eq(1).contains('Not Reported').should('exist');
    cy.get('[data-row-key="SE_X9RPH18C"] td[class="ant-table-cell"]').eq(2).contains('HiSeq X Ten').should('exist');
    cy.get('[data-row-key="SE_X9RPH18C"] td[class="ant-table-cell"]').eq(3).contains('Not Reported').should('exist');
    cy.get('[data-row-key="SE_X9RPH18C"] td[class="ant-table-cell"]').eq(4).contains('IWG_IND-GMKFWC.CDH667-1_2pA').should('exist');
    cy.get('[data-row-key="SE_X9RPH18C"] td[class="ant-table-cell"]').eq(5).contains('2016-01-26T00:00:00+00:00').should('exist');
    cy.get('[data-row-key="SE_X9RPH18C"] td[class="ant-table-cell"]').eq(6).contains('IWG_IND-GMKFWC.CDH667-1_2pA').should('exist');
  });
  
  it('Panneau Experimental Procedure (Imaging)', () => {
    cy.visitFileEntity('dr-2ahd9kpwqk');
    cy.get('[id="experimental-procedure"]').should('not.exist');
  });
  
  it('Panneau Imaging Study', () => {
    cy.get('[id="imaging"]').should('not.exist');
  });
  
  it('Panneau Imaging Study (Imaging)', () => {
    cy.visitFileEntity('dr-2ahd9kpwqk');
    cy.get('[id="imaging"] [class="ant-descriptions-item-label"]').eq(0).contains('Modality').should('exist');
    cy.get('[id="imaging"] [class="ant-descriptions-item-content"]').eq(0).contains('MR').should('exist');
    cy.get('[id="imaging"] [class="ant-descriptions-item-label"]').eq(1).contains('Sequence Type').should('exist');
    cy.get('[id="imaging"] [class="ant-descriptions-item-content"]').eq(1).contains('Diffusion').should('exist');
    cy.get('[id="imaging"] [class="ant-descriptions-item-label"]').eq(2).contains('Technique').should('exist');
    cy.get('[id="imaging"] [class="ant-descriptions-item-content"]').eq(2).contains('Functional').should('exist');
    cy.get('[id="imaging"] [class="ant-descriptions-item-label"]').eq(3).contains('Body Part').should('exist');
    cy.get('[id="imaging"] [class="ant-descriptions-item-content"]').eq(3).contains('CTSPINE').should('exist');
    cy.get('[id="imaging"] [class="ant-descriptions-item-label"]').eq(4).contains('Field Str.').should('exist');
    cy.get('[id="imaging"] [class="ant-descriptions-item-content"]').eq(4).contains('1.3717760004328263').should('exist');
    cy.get('[id="imaging"] [class="ant-descriptions-item-label"]').eq(5).contains('Device Manufacturer').should('exist');
    cy.get('[id="imaging"] [class="ant-descriptions-item-content"]').eq(5).contains('Canon').should('exist');
    cy.get('[id="imaging"] [class="ant-descriptions-item-label"]').eq(6).contains('Device Model').should('exist');
    cy.get('[id="imaging"] [class="ant-descriptions-item-content"]').eq(6).contains('Avanto_fit').should('exist');
    cy.get('[id="imaging"] [class="ant-descriptions-item-label"]').eq(7).contains('Device ID').should('exist');
    cy.get('[id="imaging"] [class="ant-descriptions-item-content"]').eq(7).contains('de-pea26nptxz').should('exist');
    cy.get('[id="imaging"] [class="ant-descriptions-item-label"]').eq(8).contains('Flywheel URL').should('exist');
    cy.get('[id="imaging"] [class="ant-descriptions-item-content"]').eq(8).contains('https://chop.flywheel.io/#/projects/LGG_v2/sessions/').should('exist');
  });
});

describe('Page d\'un fichier - Valider les liens disponibles', () => {
  it('Lien dbGaP Accession Number du panneau Data Access', () => {
    cy.get('[id="data-access"] [class="ant-descriptions-item-content"]').eq(1).find('[href]')
      .should('have.attr', 'href', 'https://www.ncbi.nlm.nih.gov/projects/gap/cgi-bin/study.cgi?study_id=phs001110');
  });

  it('Lien DataExploration du panneau Participants-Samples', () => {
    cy.get('[id="participant-sample"] [class="ant-collapse-header"] button').clickAndWait({force: true}); // data-cy="Participants_RedirectLink"
    cy.get('[class*="Participants_participantTabWrapper"]').should('exist'); // data-cy="ProTable_Participants"
    cy.get('[class*="QueryBar_selected"] [class*="QueryPill_field"]').contains('File ID').should('exist');
    cy.get('[class*="QueryBar_selected"] [class*="QueryValues_value"]').contains('GF 6DVS70V9').should('exist');
  });

  it('Lien Participant ID du panneau Participants-Samples', () => {
    cy.resetColumns('participant-sample');
    cy.get('[data-row-key="BS_VMV9N2KK"] td[class="ant-table-cell"]').eq(0).find('[href]').clickAndWait({force: true});
    cy.get('[id="participant-entity-page"]').should('exist');
    cy.get('[class*="EntityTitle"]').contains('PT_1DYA8779');
  });

  it('Lien Flywheel URL du panneau Imaging Study', () => {
    cy.visitFileEntity('dr-2ahd9kpwqk');
    cy.get('[id="imaging"] [class="ant-descriptions-item-content"]').eq(8).find('[href]')
      .should('have.attr', 'href').and('match', /https\:\/\/chop\.flywheel\.io\/\#\/projects\/LGG_v2\/sessions\/session-(0|1)-patient_09/);
  });
});

describe('Page d\'un fichier - Valider les panneaux masquables', () => {
  it('Panneau Summary', () => {
    cy.get('[id="summary"] div[class*="ant-collapse-content-active"]').should('exist');
    cy.get('[id="summary"] span[class*="ant-collapse-arrow"]').clickAndWait({force: true});
    cy.get('[id="summary"] div[class*="ant-collapse-content-inactive ant-collapse-content-hidden"]').should('exist');
    cy.get('[id="summary"] span[class*="ant-collapse-arrow"]').clickAndWait({force: true});
    cy.get('[id="summary"] div[class*="ant-collapse-content-active"]').should('exist');
  });

  it('Panneau Data Access', () => {
    cy.get('[id="data-access"] div[class*="ant-collapse-content-active"]').should('exist');
    cy.get('[id="data-access"] span[class*="ant-collapse-arrow"]').clickAndWait({force: true});
    cy.get('[id="data-access"] div[class*="ant-collapse-content-inactive ant-collapse-content-hidden"]').should('exist');
    cy.get('[id="data-access"] span[class*="ant-collapse-arrow"]').clickAndWait({force: true});
    cy.get('[id="data-access"] div[class*="ant-collapse-content-active"]').should('exist');
  });

  it('Panneau Data Type', () => {
    cy.get('[id="data-type"] div[class*="ant-collapse-content-active"]').should('exist');
    cy.get('[id="data-type"] span[class*="ant-collapse-arrow"]').clickAndWait({force: true});
    cy.get('[id="data-type"] div[class*="ant-collapse-content-inactive ant-collapse-content-hidden"]').should('exist');
    cy.get('[id="data-type"] span[class*="ant-collapse-arrow"]').clickAndWait({force: true});
    cy.get('[id="data-type"] div[class*="ant-collapse-content-active"]').should('exist');
  });

  it('Panneau Participants-Samples', () => {
    cy.get('[id="participant-sample"] div[class*="ant-collapse-content-active"]').should('exist');
    cy.get('[id="participant-sample"] span[class*="ant-collapse-arrow"]').clickAndWait({force: true});
    cy.get('[id="participant-sample"] div[class*="ant-collapse-content-inactive ant-collapse-content-hidden"]').should('exist');
    cy.get('[id="participant-sample"] span[class*="ant-collapse-arrow"]').clickAndWait({force: true});
    cy.get('[id="participant-sample"] div[class*="ant-collapse-content-active"]').should('exist');
  });

  it('Panneau Experimental Procedure', () => {
    cy.get('[id="experimental-procedure"] div[class*="ant-collapse-content-active"]').should('exist');
    cy.get('[id="experimental-procedure"] span[class*="ant-collapse-arrow"]').clickAndWait({force: true});
    cy.get('[id="experimental-procedure"] div[class*="ant-collapse-content-inactive ant-collapse-content-hidden"]').should('exist');
    cy.get('[id="experimental-procedure"] span[class*="ant-collapse-arrow"]').clickAndWait({force: true});
    cy.get('[id="experimental-procedure"] div[class*="ant-collapse-content-active"]').should('exist');
  });

  it('Panneau Imaging Study', () => {
    cy.visitFileEntity('dr-2ahd9kpwqk');
    cy.get('[id="imaging"] div[class*="ant-collapse-content-active"]').should('exist');
    cy.get('[id="imaging"] span[class*="ant-collapse-arrow"]').clickAndWait({force: true});
    cy.get('[id="imaging"] div[class*="ant-collapse-content-inactive ant-collapse-content-hidden"]').should('exist');
    cy.get('[id="imaging"] span[class*="ant-collapse-arrow"]').clickAndWait({force: true});
    cy.get('[id="imaging"] div[class*="ant-collapse-content-active"]').should('exist');
  });
});
