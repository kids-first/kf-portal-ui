/// <reference types="cypress"/>
import '../../support/commands';

beforeEach(() => {
  cy.login();
  cy.visitVariantEntityPage('1-156176849-G-A', 1);
});

describe('Page d\'un variant - Valider les panneaux masquables', () => {
  it('Panneau Transcripts', () => {
    cy.get('[id="consequence"] div[class*="ant-collapse-content-active"]').should('exist');
    cy.get('[id="consequence"] span[class*="ant-collapse-arrow"]').clickAndWait({force: true});
    cy.get('[id="consequence"] div[class*="ant-collapse-content-inactive ant-collapse-content-hidden"]').should('exist');
    cy.get('[id="consequence"] span[class*="ant-collapse-arrow"]').clickAndWait({force: true});
    cy.get('[id="consequence"] div[class*="ant-collapse-content-active"]').should('exist');
  });

  it('Panneau Kids First Studies', () => {
    cy.get('[id="frequency"] [class*="Collapse_fuiCollapse"] div[class*="ant-collapse-content-active"]').should('exist');
    cy.get('[id="frequency"] [class*="Collapse_fuiCollapse"] span[class*="ant-collapse-arrow"]').clickAndWait({force: true});
    cy.get('[id="frequency"] [class*="Collapse_fuiCollapse"] div[class*="ant-collapse-content-inactive ant-collapse-content-hidden"]').should('exist');
    cy.get('[id="frequency"] [class*="Collapse_fuiCollapse"] span[class*="ant-collapse-arrow"]').clickAndWait({force: true});
    cy.get('[id="frequency"] [class*="Collapse_fuiCollapse"] div[class*="ant-collapse-content-active"]').should('exist');
  });

  it('Panneau Public Cohorts', () => {
    cy.get('[class*="EntityTable_container"]').eq(2).find('[class*="Collapse_fuiCollapse"] div[class*="ant-collapse-content-active"]').should('exist');
    cy.get('[class*="EntityTable_container"]').eq(2).find('[class*="Collapse_fuiCollapse"] span[class*="ant-collapse-arrow"]').clickAndWait({force: true});
    cy.get('[class*="EntityTable_container"]').eq(2).find('[class*="Collapse_fuiCollapse"] div[class*="ant-collapse-content-inactive ant-collapse-content-hidden"]').should('exist');
    cy.get('[class*="EntityTable_container"]').eq(2).find('[class*="Collapse_fuiCollapse"] span[class*="ant-collapse-arrow"]').clickAndWait({force: true});
    cy.get('[class*="EntityTable_container"]').eq(2).find('[class*="Collapse_fuiCollapse"] div[class*="ant-collapse-content-active"]').should('exist');
  });

  it('Panneau ClinVar', () => {
    cy.get('[id="pathogenicity"] [class*="Collapse_fuiCollapse"] div[class*="ant-collapse-content-active"]').should('exist');
    cy.get('[id="pathogenicity"] [class*="Collapse_fuiCollapse"] span[class*="ant-collapse-arrow"]').clickAndWait({force: true});
    cy.get('[id="pathogenicity"] [class*="Collapse_fuiCollapse"] div[class*="ant-collapse-content-inactive ant-collapse-content-hidden"]').should('exist');
    cy.get('[id="pathogenicity"] [class*="Collapse_fuiCollapse"] span[class*="ant-collapse-arrow"]').clickAndWait({force: true});
    cy.get('[id="pathogenicity"] [class*="Collapse_fuiCollapse"] div[class*="ant-collapse-content-active"]').should('exist');
  });

  it('Panneau Gene - Phenotype Association', () => {
    cy.get('[id="condition"] [class*="Collapse_fuiCollapse"] div[class*="ant-collapse-content-active"]').should('exist');
    cy.get('[id="condition"] [class*="Collapse_fuiCollapse"] span[class*="ant-collapse-arrow"]').clickAndWait({force: true});
    cy.get('[id="condition"] [class*="Collapse_fuiCollapse"] div[class*="ant-collapse-content-inactive ant-collapse-content-hidden"]').should('exist');
    cy.get('[id="condition"] [class*="Collapse_fuiCollapse"] span[class*="ant-collapse-arrow"]').clickAndWait({force: true});
    cy.get('[id="condition"] [class*="Collapse_fuiCollapse"] div[class*="ant-collapse-content-active"]').should('exist');
  });
});
