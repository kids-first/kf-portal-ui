/// <reference types="cypress"/>
import '../../support/commands';

beforeEach(() => {
  cy.login();
  cy.visitFileEntity('GF_6DVS70V9');
});

describe('Page d\'un fichier - Vérifier les informations affichées', () => {
  it('Titre', () => {
    cy.get('[class*="EntityTitle"]').contains('GF_6DVS70V9');
  });

  it('Panneau Summary', () => {
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
    cy.get('[id="summary"] [class="ant-descriptions-item-content"]').eq(5).contains('drs://').should('exist');
    cy.get('[id="summary"] [class="ant-descriptions-item-label"]').eq(6).contains('Hash').should('exist');
    cy.get('[id="summary"] [class="ant-descriptions-item-content"]').eq(6).contains(/(-|^(?!-).*$)/).should('exist');
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
    cy.get('[data-row-key="BS_VMV9N2KK"] td[class="ant-table-cell"]').eq(6).contains('SA_37W3KNMD').should('exist');
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
    cy.get('[id="imaging"] [class="ant-descriptions-item-label"]').eq(8).contains('Session').should('exist');
    cy.get('[id="imaging"] [class="ant-descriptions-item-content"]').eq(8).contains('2').should('exist');
    cy.get('[id="imaging"] [class="ant-descriptions-item-label"]').eq(9).contains('Acquisition ID').should('exist');
    cy.get('[id="imaging"] [class="ant-descriptions-item-content"]').eq(9).contains('acq-0-session-0-patient_09').should('exist');
    cy.get('[id="imaging"] [class="ant-descriptions-item-label"]').eq(10).contains('Flywheel URL').should('exist');
    cy.get('[id="imaging"] [class="ant-descriptions-item-content"]').eq(10).contains('https://chop.flywheel.io/#/projects/LGG_v2/sessions/session-0-patient_09').should('exist');
  });
});
