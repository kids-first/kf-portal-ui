/// <reference types="cypress"/>
import '../../support/commands';

beforeEach(() => {
  cy.login();
  cy.visitDataExploration('participants');
  cy.get('[data-cy="SidebarMenuItem_Participant"]').clickAndWait({force: true});
  cy.createSetIfNotExists('Cypress_SB', 0);
  cy.visitDashboard();
});

describe('Page Dashboard - Widget Saved Sets', () => {
  it('Vérifier les informations affichées - Nom', () => {
    cy.get('[class*="SavedSets_setTabs"]').contains('Cypress_SB').should('exist');
  });

  it('Vérifier les informations affichées - Stamp', () => {
    cy.get('[class*="SavedSets_setTabs"]').contains('Last saved:').should('exist');
    cy.get('[class*="SavedSets_setTabs"]').contains(' ago').should('exist');
  });

  it('Valider les liens disponibles - Nom', () => {
    cy.get('[class*="SavedSets_setTabs"] [data-node-key="biospecimen"]').clickAndWait({force: true});
    cy.get('[class*="SavedSets_setTabs"]').contains('Cypress Biospecimens').clickAndWait({force: true});
    cy.get('[class*="Biospecimens_biospecimenTabWrapper"]').should('exist');
    cy.get('[class*="QueryBar_selected"] [class*="QueryPill_field"]').contains('Biospecimen').should('exist');
    cy.get('[class*="QueryBar_selected"] [class*="QueryValues_value"]').contains('Cypress Biospecimens').should('exist');

    cy.visitDashboard();
    cy.get('[class*="SavedSets_setTabs"] [data-node-key="files"]').clickAndWait({force: true});
    cy.get('[class*="SavedSets_setTabs"]').contains('Cypress Data Files').clickAndWait({force: true});
    cy.get('[class*="DataFiles_dataFilesTabWrapper"]').should('exist');
    cy.get('[class*="QueryBar_selected"] [class*="QueryPill_field"]').contains('File ID').should('exist');
    cy.get('[class*="QueryBar_selected"] [class*="QueryValues_value"]').contains('Cypress Data Files').should('exist');

    cy.visitDashboard();
    cy.get('[class*="SavedSets_setTabs"] [data-node-key="variants"]').clickAndWait({force: true});
    cy.get('[class*="SavedSets_setTabs"]').contains('Cypress Variants').clickAndWait({force: true});
    cy.get('[class*="VariantsTable_variantTabWrapper"]').should('exist');
    cy.get('[class*="QueryBar_selected"] [class*="QueryPill_field"]').contains('Variant ID').should('exist');
    cy.get('[class*="QueryBar_selected"] [class*="QueryValues_value"]').contains('Cypress Variants').should('exist');
  });

  it('Valider les liens disponibles - Bouton Delete', () => {
    cy.get('[class*="ListItemWithActions_fuiListItemWithActions"]').each(($el: JQuery<HTMLElement>) => {
      if ($el.text().includes('Cypress_SB')) {
        cy.wrap($el).find('svg[data-icon="delete"]').clickAndWait({force:true});
      }
    });
    cy.clickAndIntercept('[class="ant-modal-content"] button[class*="ant-btn-dangerous"]', 'DELETE', '**/sets/**', 1);
    cy.get('[class*="SavedSets_setTabs"]').contains('Cypress_SB').should('not.exist');
  });
});
