/// <reference types="cypress"/>
import '../../support/commands';

beforeEach(() => {
  cy.login();
  cy.visitVariantsSomaticPage('?sharedFilterId=d9f2ccfa-9d56-40c1-899f-836d0546af6a');
  cy.get(`[data-cy="SidebarMenuItem_Gene"]`).clickAndWait({force: true});
  cy.get('button[class*="UploadIdsButton"]').clickAndWait({force: true});
  cy.get('[class*="UploadModal"] textarea').type('prdx1,nkefa ensg00000117450\nunknown');
});

describe('Page des variants (Somatic) - Téléverser une liste de gènes', () => {
  it('Vérifier les informations affichées - Popover', () => {
    cy.get('[class*="UploadModal"] [class*="anticon-info-circle"]').trigger('mouseover', {eventConstructor: 'MouseEvent', force: true});

    cy.get('[class*="GeneUploadIds_geneUploadIdsPopover"]').should('not.have.class', 'ant-popover-hidden');
    cy.get('[class*="GeneUploadIds_geneUploadIdsPopover"]').contains('Identifiers and File Formats').should('exist');
    cy.get('[class*="GeneUploadIds_geneUploadIdsPopover"]').contains('Identifiers').should('exist');
    cy.get('[class*="GeneUploadIds_geneUploadIdsPopover"]').contains('Gene Symbol, Gene Alias, Ensembl ID').should('exist');
    cy.get('[class*="GeneUploadIds_geneUploadIdsPopover"]').contains('Separated by').should('exist');
    cy.get('[class*="GeneUploadIds_geneUploadIdsPopover"]').contains('comma, space, new line').should('exist');
    cy.get('[class*="GeneUploadIds_geneUploadIdsPopover"]').contains('Upload file formats').should('exist');
    cy.get('[class*="GeneUploadIds_geneUploadIdsPopover"]').contains('.txt, .csv, .tsv').should('exist');
  });

  it('Valider les fonctionnalités de la modal - Bouton Supprimer', () => {
    cy.get('[class*="UploadModal"] textarea').contains('prdx1').should('exist');
    cy.get('[class*="UploadModal"] button[class*="ant-btn-text"]').clickAndWait({force: true});

    cy.get('[class*="UploadModal"] textarea').contains('prdx1').should('not.exist');
    cy.get('[class*="UploadModal"] button[class*="ant-btn-text"]').should('not.exist');
  });
  
  it('Valider les fonctionnalités de la modal - Bouton Annuler', () => {
    cy.get('[class="ant-modal-footer"] button[class*="ant-btn-default"]').clickAndWait({force: true});

    cy.get('[class*="QueryBar_selected"] [class*="QueryPill_field"]').contains('Gene').should('not.exist');
  });

  it('Valider les fonctionnalités de la modal - Section Résumé masquable', () => {
    cy.get('[class*="UploadModal"] [class="ant-collapse-header-text"]').contains('Summary Table (3 matched, 1 unmatched)').should('exist');

    cy.get('[class*="UploadModal"] span[class*="ant-collapse-arrow"]').clickAndWait({force: true});
    cy.get('[class*="UploadModal"] div[class*="ant-collapse-content-active"]').should('exist');

    cy.get('[class*="UploadModal"] span[class*="ant-collapse-arrow"]').clickAndWait({force: true});
    cy.get('[class*="UploadModal"] div[class*="ant-collapse-content-inactive ant-collapse-content-hidden"]').should('exist');
  });

  it('Vérifier les informations affichées - Section Résumé (onglet Reconnus)', () => {
    cy.get('[class*="UploadModal"] span[class*="ant-collapse-arrow"]').clickAndWait({force: true});

    cy.get('[class*="UploadModal_tablesMessages"]').contains('4 submitted identifiers mapped to 1 unique system identifiers').should('exist');
    cy.get('[data-node-key="matched"]').contains('Matched (3)').should('exist');
    cy.get('[id*="panel-matched"] thead').contains('Submitted gene identifiers').should('exist');
    cy.get('[id*="panel-matched"] thead').contains('Mapped to').should('exist');
    cy.get('[id*="panel-matched"] thead').contains('Ensembl ID').should('exist');
    cy.get('[id*="panel-matched"] thead').contains('Symbol').should('exist');
    cy.get('[id*="panel-matched"] [data-row-key="176763:0"] td').eq(0).contains('prdx1').should('exist');
    cy.get('[id*="panel-matched"] [data-row-key="176763:0"] td').eq(1).contains('ENSG00000117450').should('exist');
    cy.get('[id*="panel-matched"] [data-row-key="176763:0"] td').eq(2).contains('PRDX1').should('exist');
    cy.get('[id*="panel-matched"] [data-row-key="176763:1"] td').eq(0).contains('nkefa').should('exist');
    cy.get('[id*="panel-matched"] [data-row-key="176763:1"] td').eq(1).contains('ENSG00000117450').should('exist');
    cy.get('[id*="panel-matched"] [data-row-key="176763:1"] td').eq(2).contains('PRDX1').should('exist');
    cy.get('[id*="panel-matched"] [data-row-key="176763:2"] td').eq(0).contains('ensg00000117450').should('exist');
    cy.get('[id*="panel-matched"] [data-row-key="176763:2"] td').eq(1).contains('ENSG00000117450').should('exist');
    cy.get('[id*="panel-matched"] [data-row-key="176763:2"] td').eq(2).contains('PRDX1').should('exist');
  });

  it('Vérifier les informations affichées - Section Résumé (onglet Inconnus)', () => {
    cy.get('[class*="UploadModal"] span[class*="ant-collapse-arrow"]').clickAndWait({force: true});
    cy.get('[data-node-key="unmatched"]').clickAndWait({force: true});

    cy.get('[data-node-key="unmatched"]').contains('Unmatched (1)').should('exist');
    cy.get('[id*="panel-unmatched"] thead').contains('Submitted gene identifiers').should('exist');
    cy.get('[id*="panel-unmatched"] thead').contains('Mapped to').should('not.exist');
    cy.get('[id*="panel-unmatched"] thead').contains('Ensembl ID').should('not.exist');
    cy.get('[id*="panel-unmatched"] thead').contains('Symbol').should('not.exist');
    cy.get('[id*="panel-unmatched"] [data-row-key="0"] td').eq(0).contains('unknown').should('exist');
    cy.get('[id*="panel-unmatched"] [data-row-key="0"] td').eq(1).should('not.exist');
  });
  
  it('Valider les fonctionnalités de la modal - Bouton Téléverser [SKFP-854]', () => {
    cy.wait(2000);
    cy.clickAndIntercept('[class="ant-modal-footer"] button[class*="ant-btn-primary"]', 'POST', '**/graphql', 3);
    cy.validatePillSelectedQuery('Gene', ['Uploaded List']);
    cy.validateTotalSelectedQuery('18');
    cy.validateTableResultsCount('18');
    cy.get('[class*="ant-select-show-search"] [class="ant-tag"]').should('not.exist');

    cy.get('[class*="QueryValues_queryValuesContainer"]').contains('Uploaded List').clickAndWait({force:true});
    cy.get('[class*="filtersDropdown"]').should('not.exist');
  });
});
