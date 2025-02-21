/// <reference types="cypress"/>
import '../../support/commands';

beforeEach(() => {
  cy.login();
  cy.visitParticipantEntity('PT_01236T3G');
});

describe('Page d\'un participant - Valider les panneaux masquables', () => {
  it('Panneau Summary', () => {
    cy.get('[id="summary"] div[class*="ant-collapse-content-active"]').should('exist');
    cy.get('[id="summary"] span[class*="ant-collapse-arrow"]').clickAndWait({force: true});
    cy.get('[id="summary"] div[class*="ant-collapse-content-inactive ant-collapse-content-hidden"]').should('exist');
    cy.get('[id="summary"] span[class*="ant-collapse-arrow"]').clickAndWait({force: true});
    cy.get('[id="summary"] div[class*="ant-collapse-content-active"]').should('exist');
  });

  it('Panneau Profile', () => {
    cy.get('[id="profile"] div[class*="ant-collapse-content-active"]').should('exist');
    cy.get('[id="profile"] span[class*="ant-collapse-arrow"]').clickAndWait({force: true});
    cy.get('[id="profile"] div[class*="ant-collapse-content-inactive ant-collapse-content-hidden"]').should('exist');
    cy.get('[id="profile"] span[class*="ant-collapse-arrow"]').clickAndWait({force: true});
    cy.get('[id="profile"] div[class*="ant-collapse-content-active"]').should('exist');
  });

  it('Panneau Family', () => {
    cy.get('[id="family"] div[class*="ant-collapse-content-active"]').should('exist');
    cy.get('[id="family"] span[class*="ant-collapse-arrow"]').clickAndWait({force: true});
    cy.get('[id="family"] div[class*="ant-collapse-content-inactive ant-collapse-content-hidden"]').should('exist');
    cy.get('[id="family"] span[class*="ant-collapse-arrow"]').clickAndWait({force: true});
    cy.get('[id="family"] div[class*="ant-collapse-content-active"]').should('exist');
  });

  it('Panneau Diagnoses', () => {
    cy.get('[id="diagnosis"] div[class*="ant-collapse-content-active"]').should('exist');
    cy.get('[id="diagnosis"] span[class*="ant-collapse-arrow"]').clickAndWait({force: true});
    cy.get('[id="diagnosis"] div[class*="ant-collapse-content-inactive ant-collapse-content-hidden"]').should('exist');
    cy.get('[id="diagnosis"] span[class*="ant-collapse-arrow"]').clickAndWait({force: true});
    cy.get('[id="diagnosis"] div[class*="ant-collapse-content-active"]').should('exist');
  });

  it('Panneau Phenotypes', () => {
    cy.get('[id="phenotype"] div[class*="ant-collapse-content-active"]').should('exist');
    cy.get('[id="phenotype"] span[class*="ant-collapse-arrow"]').clickAndWait({force: true});
    cy.get('[id="phenotype"] div[class*="ant-collapse-content-inactive ant-collapse-content-hidden"]').should('exist');
    cy.get('[id="phenotype"] span[class*="ant-collapse-arrow"]').clickAndWait({force: true});
    cy.get('[id="phenotype"] div[class*="ant-collapse-content-active"]').should('exist');
  });

  it('Panneau Biospecimens', () => {
    cy.get('[id="biospecimen"] div[class*="ant-collapse-content-active"]').should('exist');
    cy.get('[id="biospecimen"] span[class*="ant-collapse-arrow"]').clickAndWait({force: true});
    cy.get('[id="biospecimen"] div[class*="ant-collapse-content-inactive ant-collapse-content-hidden"]').should('exist');
    cy.get('[id="biospecimen"] span[class*="ant-collapse-arrow"]').clickAndWait({force: true});
    cy.get('[id="biospecimen"] div[class*="ant-collapse-content-active"]').should('exist');
  });

  it('Panneau Files', () => {
    cy.get('[id="files"] div[class*="ant-collapse-content-active"]').should('exist');
    cy.get('[id="files"] span[class*="ant-collapse-arrow"]').clickAndWait({force: true});
    cy.get('[id="files"] div[class*="ant-collapse-content-inactive ant-collapse-content-hidden"]').should('exist');
    cy.get('[id="files"] span[class*="ant-collapse-arrow"]').clickAndWait({force: true});
    cy.get('[id="files"] div[class*="ant-collapse-content-active"]').should('exist');
  });
});
