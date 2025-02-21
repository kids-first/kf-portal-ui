/// <reference types="cypress"/>
import '../../support/commands';

beforeEach(() => {
  cy.login();
  cy.visitDataExploration('participants');
  cy.get('[data-cy="SidebarMenuItem_Participant"]').clickAndWait({force: true});
  cy.get('button[class*="UploadIdsButton"]').clickAndWait({force: true});
  cy.get('[class*="UploadModal"] textarea').type('pt_01236t3g,01-0665 fm_z4y7fp70\nunknown');
});

describe('Page Data Exploration (Participants) - Téléverser une liste d\'identifiants', () => {
  it('Vérifier les informations affichées - Popover', () => {
    cy.get('[class*="UploadModal"] [class*="anticon-info-circle"]').trigger('mouseover', {eventConstructor: 'MouseEvent', force: true});

    cy.get('[class*="EntityUploadIds_entityUploadIdsPopover"]').should('not.have.class', 'ant-popover-hidden');
    cy.get('[class*="EntityUploadIds_entityUploadIdsPopover"]').contains('Identifiers and File Formats').should('exist');
    cy.get('[class*="EntityUploadIds_entityUploadIdsPopover"]').contains('Identifiers').should('exist');
    cy.get('[class*="EntityUploadIds_entityUploadIdsPopover"]').contains('Participant ID, External Participant ID, Family ID').should('exist');
    cy.get('[class*="EntityUploadIds_entityUploadIdsPopover"]').contains('Separated by').should('exist');
    cy.get('[class*="EntityUploadIds_entityUploadIdsPopover"]').contains('comma, space, new line').should('exist');
    cy.get('[class*="EntityUploadIds_entityUploadIdsPopover"]').contains('Upload file formats').should('exist');
    cy.get('[class*="EntityUploadIds_entityUploadIdsPopover"]').contains('.txt, .csv, .tsv').should('exist');
  });

  it('Valider les fonctionnalités de la modal - Bouton Supprimer', () => {
    cy.get('[class*="UploadModal"] textarea').contains('pt_01236t3g').should('exist');
    cy.get('[class*="UploadModal"] button[class*="ant-btn-text"]').clickAndWait({force: true});

    cy.get('[class*="UploadModal"] textarea').contains('pt_01236t3g').should('not.exist');
    cy.get('[class*="UploadModal"] button[class*="ant-btn-text"]').should('not.exist');
  });
  
  it('Valider les fonctionnalités de la modal - Bouton Annuler', () => {
    cy.get('[class="ant-modal-footer"] button[class*="ant-btn-default"]').clickAndWait({force: true});

    cy.get('body').contains('Use the search tools & facets on the left to build a query').should('exist');
  });

  it('Valider les fonctionnalités de la modal - Section Résumé masquable', () => {
    cy.get('[class*="UploadModal"] [class="ant-collapse-header-text"]').contains('Summary Table (5 matched, 1 unmatched)').should('exist');

    cy.get('[class*="UploadModal"] span[class*="ant-collapse-arrow"]').clickAndWait({force: true});
    cy.get('[class*="UploadModal"] div[class*="ant-collapse-content-active"]').should('exist');

    cy.get('[class*="UploadModal"] span[class*="ant-collapse-arrow"]').clickAndWait({force: true});
    cy.get('[class*="UploadModal"] div[class*="ant-collapse-content-inactive ant-collapse-content-hidden"]').should('exist');
  });

  it('Vérifier les informations affichées - Section Résumé (onglet Reconnus)', () => {
    cy.get('[class*="UploadModal"] span[class*="ant-collapse-arrow"]').clickAndWait({force: true});

    cy.get('[class*="UploadModal_tablesMessages"]').contains('4 submitted identifiers mapped to 3 unique system identifiers').should('exist');
    cy.get('[data-node-key="matched"]').contains('Matched (5)').should('exist');
    cy.get('[id*="panel-matched"] thead').contains('Submitted participant identifiers').should('exist');
    cy.get('[id*="panel-matched"] thead').contains('Mapped to').should('exist');
    cy.get('[id*="panel-matched"] thead').contains('Participant ID').should('exist');
    cy.get('[id*="panel-matched"] thead').contains('Study').should('exist');
    cy.get('[id*="panel-matched"] [data-row-key="pt-01236t3g:0"] td').eq(0).contains('pt_01236t3g').should('exist');
    cy.get('[id*="panel-matched"] [data-row-key="pt-01236t3g:0"] td').eq(1).contains('PT_01236T3G').should('exist');
    cy.get('[id*="panel-matched"] [data-row-key="pt-01236t3g:0"] td').eq(2).contains('KF-CDH').should('exist');
    cy.get('[id*="panel-matched"] [data-row-key="pt-01236t3g:1"] td').eq(0).contains('01-0665').should('exist');
    cy.get('[id*="panel-matched"] [data-row-key="pt-01236t3g:1"] td').eq(1).contains('PT_01236T3G').should('exist');
    cy.get('[id*="panel-matched"] [data-row-key="pt-01236t3g:1"] td').eq(2).contains('KF-CDH').should('exist');
    cy.get('[id*="panel-matched"] [data-row-key="pt-01236t3g:2"] td').eq(0).contains('fm_z4y7fp70').should('exist');
    cy.get('[id*="panel-matched"] [data-row-key="pt-01236t3g:2"] td').eq(1).contains('PT_01236T3G').should('exist');
    cy.get('[id*="panel-matched"] [data-row-key="pt-01236t3g:2"] td').eq(2).contains('KF-CDH').should('exist');
    cy.get('[id*="panel-matched"] [data-row-key="pt-rzvc67gc:0"] td').eq(0).contains('fm_z4y7fp70').should('exist');
    cy.get('[id*="panel-matched"] [data-row-key="pt-rzvc67gc:0"] td').eq(1).contains('PT_RZVC67GC').should('exist');
    cy.get('[id*="panel-matched"] [data-row-key="pt-rzvc67gc:0"] td').eq(2).contains('KF-CDH').should('exist');
    cy.get('[id*="panel-matched"] [data-row-key="pt-1dya8779:0"] td').eq(0).contains('fm_z4y7fp70').should('exist');
    cy.get('[id*="panel-matched"] [data-row-key="pt-1dya8779:0"] td').eq(1).contains('PT_1DYA8779').should('exist');
    cy.get('[id*="panel-matched"] [data-row-key="pt-1dya8779:0"] td').eq(2).contains('KF-CDH').should('exist');
  });

  it('Vérifier les informations affichées - Section Résumé (onglet Inconnus)', () => {
    cy.get('[class*="UploadModal"] span[class*="ant-collapse-arrow"]').clickAndWait({force: true});
    cy.get('[data-node-key="unmatched"]').clickAndWait({force: true});

    cy.get('[data-node-key="unmatched"]').contains('Unmatched (1)').should('exist');
    cy.get('[id*="panel-unmatched"] thead').contains('Submitted participant identifiers').should('exist');
    cy.get('[id*="panel-unmatched"] thead').contains('Mapped to').should('not.exist');
    cy.get('[id*="panel-unmatched"] thead').contains('Participant ID').should('not.exist');
    cy.get('[id*="panel-unmatched"] thead').contains('Study').should('not.exist');
    cy.get('[id*="panel-unmatched"] [data-row-key="0"] td').eq(0).contains('unknown').should('exist');
    cy.get('[id*="panel-unmatched"] [data-row-key="0"] td').eq(1).should('not.exist');
  });
  
  it('Valider les fonctionnalités de la modal - Bouton Téléverser', () => {
    cy.wait(2000);
    cy.clickAndIntercept('[class="ant-modal-footer"] button[class*="ant-btn-primary"]', 'POST', '**/graphql', 3);

    cy.validatePillSelectedQuery('Participant ID', ['Uploaded List']);
    cy.validateTotalSelectedQuery('3');
    cy.validateTableResultsCount('3');
    cy.get('[class*="ant-select-show-search"] [class="ant-tag"]').should('not.exist');

    cy.get('[class*="QueryValues_queryValuesContainer"]').contains('Uploaded List').clickAndWait({force:true});
    cy.get('[class*="filtersDropdown"]').should('not.exist');
  });
});
