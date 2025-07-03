/// <reference types="cypress"/>
import '../../support/commands';

beforeEach(() => {
  cy.login();
  cy.visitDataExploration('datafiles', '?sharedFilterId=c0f70cfd-a161-4444-881f-0cb0e6a68a6d');
  cy.showColumn('Session');
  cy.showColumn('File Name');
  cy.showColumn('Platform');
  cy.showColumn('Repository');
  cy.showColumn('ACL');
  cy.showColumn('Access URL');
  cy.showColumn('Flywheel');
  cy.showColumn('Modality');
  cy.showColumn('Sequence Type');
  cy.showColumn('Technique');
  cy.showColumn('Body Part');
  cy.showColumn('Field Str.');
  cy.showColumn('Device Manufacturer');
  cy.showColumn('Device Model');
  cy.showColumn('Device ID');
  cy.sortTableAndIntercept('Data Category', 1);
  cy.get('[class*="Pagination"] span[class*="ant-select-selection-item"]').clickAndWait({force: true});
  cy.get('div[class*="ant-select-item-option-content"]').contains('100').clickAndWait({force: true});
});

describe('Page Data Exploration (Data Files) - Valider les liens disponibles', () => {
  it('Lien File ID du tableau', () => {
    cy.get('tr[data-row-key="GF_6DVS70V9"] [class*="ant-table-cell"]').eq(3).find('[href]').clickAndWait({force: true});
    cy.get('[id="file-entity-page"]').should('exist');
    cy.get('[class*="EntityTitle"]').contains('GF_6DVS70V9');
  });

  it('Lien Participants du tableau', () => {
    cy.get('tr[data-row-key="GF_6DVS70V9"] [class*="ant-table-cell"]').eq(10).find('[href]').clickAndWait({force: true});
    cy.get('[class*="Participants_participantTabWrapper"]').should('exist'); // data-cy="ProTable_Participants"
    cy.get('[class*="QueryBar_selected"] [class*="QueryPill_field"]').contains('File ID').should('exist');
    cy.get('[class*="QueryBar_selected"] [class*="QueryValues_value"]').contains('GF 6DVS70V9').should('exist');
    cy.validateTableResultsCount(/^3$/);
  });

  it('Lien Biospecimens du tableau', () => {
    cy.get('tr[data-row-key="GF_6DVS70V9"] [class*="ant-table-cell"]').eq(12).find('[href]').clickAndWait({force: true});
    cy.get('[class*="Biospecimens_biospecimenTabWrapper"]').should('exist'); // data-cy="ProTable_Biospecimens"
    cy.get('[class*="QueryBar_selected"] [class*="QueryPill_field"]').contains('File ID').should('exist');
    cy.get('[class*="QueryBar_selected"] [class*="QueryValues_value"]').contains('GF 6DVS70V9').should('exist');
    cy.validateTableResultsCount(/^3$/);
  });
 
  it('Liens Flywheel', () => {
    cy.get('tr[data-row-key="dr-2ahd9kpwqk"] [class*="ant-table-cell"]').eq(18).find('a[href]')
      .should('have.attr', 'href').and('match', /https\:\/\/chop\.flywheel\.io\/\#\/projects\/LGG_v2\/sessions\/session-0-patient_09/);
  });
});
