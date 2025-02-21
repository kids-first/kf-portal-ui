/// <reference types="cypress"/>
import '../../support/commands';

beforeEach(() => {
  cy.login();
  cy.visitFileEntity('GF_6DVS70V9');
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
      .should('have.attr', 'href').and('match', /https\:\/\/chop\.flywheel\.io\/\#\/projects\/LGG_v2\/sessions\/session-0-patient_09/);
  });
});
