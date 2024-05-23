/// <reference types="Cypress" />
import '../../support/commands';

const epCHUSJ_ldmCHUSJ = JSON.parse(Cypress.env('presc_EP_CHUSJ_LDM_CHUSJ'));

beforeEach(() => {
//  cy.login(Cypress.env('username_DG_CHUSJ_CUSM_CHUS'), Cypress.env('password'));
});

describe('Page des prescriptions et requêtes - Rechercher des prescriptions', () => {

  beforeEach(() => {
//    cy.visitPrescriptionsPage();
    cy.checkValueFacet('Statut des prescriptions', 'active');
  });

  it('Par numéro de prescription', () => {
    cy.typeAndIntercept('[data-cy="PrescriptionsSearch"]', epCHUSJ_ldmCHUSJ.prescriptionId, 'POST', '**/graphql', 4*epCHUSJ_ldmCHUSJ.prescriptionId.length);
    cy.waitWhileSpin(60*1000);

    cy.get('body').contains('Prescriptions (1)', {timeout: 60*1000}).should('exist');
    cy.get('body').contains(epCHUSJ_ldmCHUSJ.prescriptionId).should('exist');
  });

  it('Par numéro de requête du cas-index', () => {
    cy.typeAndIntercept('[data-cy="PrescriptionsSearch"]', epCHUSJ_ldmCHUSJ.requestProbId, 'POST', '**/graphql', 4*epCHUSJ_ldmCHUSJ.requestProbId.length);
    cy.waitWhileSpin(60*1000);

    cy.get('body').contains('Prescriptions (1)', {timeout: 60*1000}).should('exist');
    cy.get('body').contains(epCHUSJ_ldmCHUSJ.prescriptionId).should('exist');
  });

  it('Par numéro de dossier du cas-index', () => {
    cy.typeAndIntercept('[data-cy="PrescriptionsSearch"]', epCHUSJ_ldmCHUSJ.mrnProb, 'POST', '**/graphql', 4*epCHUSJ_ldmCHUSJ.mrnProb.length);
    cy.waitWhileSpin(60*1000);

    cy.get('body').contains('Prescriptions (1)', {timeout: 60*1000}).should('exist');
    cy.get('body').contains(epCHUSJ_ldmCHUSJ.prescriptionId).should('exist');
  });

  it('Par numéro de patient du cas-index', () => {
    cy.typeAndIntercept('[data-cy="PrescriptionsSearch"]', epCHUSJ_ldmCHUSJ.patientProbId, 'POST', '**/graphql', 4*epCHUSJ_ldmCHUSJ.patientProbId.length);
    cy.waitWhileSpin(60*1000);

    cy.get('body').contains('Prescriptions (1)', {timeout: 60*1000}).should('exist');
    cy.get('body').contains(epCHUSJ_ldmCHUSJ.prescriptionId).should('exist');
  });

  it('Par numéro d\'échantillon du cas-index', () => {
    cy.typeAndIntercept('[data-cy="PrescriptionsSearch"]', epCHUSJ_ldmCHUSJ.sampleProbId, 'POST', '**/graphql', 4*epCHUSJ_ldmCHUSJ.sampleProbId.length);
    cy.waitWhileSpin(60*1000);

    cy.get('body').contains('Prescriptions (1)', {timeout: 60*1000}).should('exist');
    cy.get('body').contains(epCHUSJ_ldmCHUSJ.prescriptionId).should('exist');
  });

  it('Par numéro de requête de la mère', () => {
    cy.typeAndIntercept('[data-cy="PrescriptionsSearch"]', epCHUSJ_ldmCHUSJ.requestMthId, 'POST', '**/graphql', 4*epCHUSJ_ldmCHUSJ.requestMthId.length);
    cy.waitWhileSpin(60*1000);

    cy.get('body').contains('Prescriptions (1)', {timeout: 60*1000}).should('exist');
    cy.get('body').contains(epCHUSJ_ldmCHUSJ.prescriptionId).should('exist');
  });

  it('Par numéro de dossier de la mère', () => {
    cy.typeAndIntercept('[data-cy="PrescriptionsSearch"]', epCHUSJ_ldmCHUSJ.mrnMth, 'POST', '**/graphql', 4*epCHUSJ_ldmCHUSJ.mrnMth.length);
    cy.waitWhileSpin(60*1000);

    cy.get('body').contains('Prescriptions (1)', {timeout: 60*1000}).should('exist');
    cy.get('body').contains(epCHUSJ_ldmCHUSJ.prescriptionId).should('exist');
  });

  it('Par numéro de patient de la mère', () => {
    cy.typeAndIntercept('[data-cy="PrescriptionsSearch"]', epCHUSJ_ldmCHUSJ.patientMthId, 'POST', '**/graphql', 4*epCHUSJ_ldmCHUSJ.patientMthId.length);
    cy.waitWhileSpin(60*1000);

    cy.get('body').contains('Prescriptions (1)', {timeout: 60*1000}).should('exist');
    cy.get('body').contains(epCHUSJ_ldmCHUSJ.prescriptionId).should('exist');
  });

  it('Par numéro d\'échantillon de la mère', () => {
    cy.typeAndIntercept('[data-cy="PrescriptionsSearch"]', epCHUSJ_ldmCHUSJ.sampleMthId, 'POST', '**/graphql', 4*epCHUSJ_ldmCHUSJ.sampleMthId.length);
    cy.waitWhileSpin(60*1000);

    cy.get('body').contains('Prescriptions (1)', {timeout: 60*1000}).should('exist');
    cy.get('body').contains(epCHUSJ_ldmCHUSJ.prescriptionId).should('exist');
  });

  it('Par numéro de requête du père', () => {
    cy.typeAndIntercept('[data-cy="PrescriptionsSearch"]', epCHUSJ_ldmCHUSJ.requestFthId, 'POST', '**/graphql', 4*epCHUSJ_ldmCHUSJ.requestFthId.length);
    cy.waitWhileSpin(60*1000);

    cy.get('body').contains('Prescriptions (1)', {timeout: 60*1000}).should('exist');
    cy.get('body').contains(epCHUSJ_ldmCHUSJ.prescriptionId).should('exist');
  });

  it('Par numéro de dossier du père', () => {
    cy.typeAndIntercept('[data-cy="PrescriptionsSearch"]', epCHUSJ_ldmCHUSJ.mrnFth, 'POST', '**/graphql', 4*epCHUSJ_ldmCHUSJ.mrnFth.length);
    cy.waitWhileSpin(60*1000);

    cy.get('body').contains('Prescriptions (1)', {timeout: 60*1000}).should('exist');
    cy.get('body').contains(epCHUSJ_ldmCHUSJ.prescriptionId).should('exist');
  });

  it('Par numéro de patient du père', () => {
    cy.typeAndIntercept('[data-cy="PrescriptionsSearch"]', epCHUSJ_ldmCHUSJ.patientFthId, 'POST', '**/graphql', 4*epCHUSJ_ldmCHUSJ.patientFthId.length);
    cy.waitWhileSpin(60*1000);

    cy.get('body').contains('Prescriptions (1)', {timeout: 60*1000}).should('exist');
    cy.get('body').contains(epCHUSJ_ldmCHUSJ.prescriptionId).should('exist');
  });

  it('Par numéro d\'échantillon du père', () => {
    cy.typeAndIntercept('[data-cy="PrescriptionsSearch"]', epCHUSJ_ldmCHUSJ.sampleFthId, 'POST', '**/graphql', 4*epCHUSJ_ldmCHUSJ.sampleFthId.length);
    cy.waitWhileSpin(60*1000);

    cy.get('body').contains('Prescriptions (1)', {timeout: 60*1000}).should('exist');
    cy.get('body').contains(epCHUSJ_ldmCHUSJ.prescriptionId).should('exist');
  });
});

describe('Page des prescriptions et requêtes - Rechercher des requêtes', () => {

  beforeEach(() => {
//    cy.visitPrescriptionsPage();
    cy.checkValueFacet('Statut des prescriptions', 'active');
    cy.get('div[id*="tab-requests"]').click({force: true});

//    cy.resetColumns(1);
  });

  it('Par numéro de prescription', () => {
    cy.typeAndIntercept('[data-cy="PrescriptionsSearch"]', epCHUSJ_ldmCHUSJ.prescriptionId, 'POST', '**/graphql', 4*epCHUSJ_ldmCHUSJ.prescriptionId.length);
    cy.waitWhileSpin(60*1000);

    cy.get('body').contains('Requêtes (3)', {timeout: 60*1000}).should('exist');
    cy.get('body').contains(epCHUSJ_ldmCHUSJ.requestProbId).should('exist');
    cy.get('body').contains(epCHUSJ_ldmCHUSJ.requestMthId).should('exist');
    cy.get('body').contains(epCHUSJ_ldmCHUSJ.requestFthId).should('exist');
  });

  it('Par numéro de requête du cas-index', () => {
    cy.typeAndIntercept('[data-cy="PrescriptionsSearch"]', epCHUSJ_ldmCHUSJ.requestProbId, 'POST', '**/graphql', 4*epCHUSJ_ldmCHUSJ.requestProbId.length);
    cy.waitWhileSpin(60*1000);

    cy.get('body').contains('Requêtes (1)', {timeout: 60*1000}).should('exist');
    cy.get('body').contains(epCHUSJ_ldmCHUSJ.requestProbId).should('exist');
  });

  it('Par numéro de dossier du cas-index', () => {
    cy.typeAndIntercept('[data-cy="PrescriptionsSearch"]', epCHUSJ_ldmCHUSJ.mrnProb, 'POST', '**/graphql', 4*epCHUSJ_ldmCHUSJ.mrnProb.length);
    cy.waitWhileSpin(60*1000);

    cy.get('body').contains('Requêtes (1)', {timeout: 60*1000}).should('exist');
    cy.get('body').contains(epCHUSJ_ldmCHUSJ.requestProbId).should('exist');
  });

  it('Par numéro de patient du cas-index', () => {
    cy.typeAndIntercept('[data-cy="PrescriptionsSearch"]', epCHUSJ_ldmCHUSJ.patientProbId, 'POST', '**/graphql', 4*epCHUSJ_ldmCHUSJ.patientProbId.length);
    cy.waitWhileSpin(60*1000);

    cy.get('body').contains('Requêtes (1)', {timeout: 60*1000}).should('exist');
    cy.get('body').contains(epCHUSJ_ldmCHUSJ.requestProbId).should('exist');
  });

  it('Par numéro d\'échantillon du cas-index', () => {
    cy.typeAndIntercept('[data-cy="PrescriptionsSearch"]', epCHUSJ_ldmCHUSJ.sampleProbId, 'POST', '**/graphql', 4*epCHUSJ_ldmCHUSJ.sampleProbId.length);
    cy.waitWhileSpin(60*1000);

    cy.get('body').contains('Requêtes (1)', {timeout: 60*1000}).should('exist');
    cy.get('body').contains(epCHUSJ_ldmCHUSJ.requestProbId).should('exist');
  });

  it('Par numéro de requête de la mère', () => {
    cy.typeAndIntercept('[data-cy="PrescriptionsSearch"]', epCHUSJ_ldmCHUSJ.requestMthId, 'POST', '**/graphql', 4*epCHUSJ_ldmCHUSJ.requestMthId.length);
    cy.waitWhileSpin(60*1000);

    cy.get('body').contains('Requêtes (1)', {timeout: 60*1000}).should('exist');
    cy.get('body').contains(epCHUSJ_ldmCHUSJ.requestMthId).should('exist');
  });

  it('Par numéro de dossier de la mère', () => {
    cy.typeAndIntercept('[data-cy="PrescriptionsSearch"]', epCHUSJ_ldmCHUSJ.mrnMth, 'POST', '**/graphql', 4*epCHUSJ_ldmCHUSJ.mrnMth.length);
    cy.waitWhileSpin(60*1000);

    cy.get('body').contains('Requêtes (1)', {timeout: 60*1000}).should('exist');
    cy.get('body').contains(epCHUSJ_ldmCHUSJ.requestMthId).should('exist');
  });

  it('Par numéro de patient de la mère', () => {
    cy.typeAndIntercept('[data-cy="PrescriptionsSearch"]', epCHUSJ_ldmCHUSJ.patientMthId, 'POST', '**/graphql', 4*epCHUSJ_ldmCHUSJ.patientMthId.length);
    cy.waitWhileSpin(60*1000);

    cy.get('body').contains('Requêtes (1)', {timeout: 60*1000}).should('exist');
    cy.get('body').contains(epCHUSJ_ldmCHUSJ.requestMthId).should('exist');
  });

  it('Par numéro d\'échantillon de la mère', () => {
    cy.typeAndIntercept('[data-cy="PrescriptionsSearch"]', epCHUSJ_ldmCHUSJ.sampleMthId, 'POST', '**/graphql', 4*epCHUSJ_ldmCHUSJ.sampleMthId.length);
    cy.waitWhileSpin(60*1000);

    cy.get('body').contains('Requêtes (1)', {timeout: 60*1000}).should('exist');
    cy.get('body').contains(epCHUSJ_ldmCHUSJ.requestMthId).should('exist');
  });

  it('Par numéro de requête du père', () => {
    cy.typeAndIntercept('[data-cy="PrescriptionsSearch"]', epCHUSJ_ldmCHUSJ.requestFthId, 'POST', '**/graphql', 4*epCHUSJ_ldmCHUSJ.requestFthId.length);
    cy.waitWhileSpin(60*1000);

    cy.get('body').contains('Requêtes (1)', {timeout: 60*1000}).should('exist');
    cy.get('body').contains(epCHUSJ_ldmCHUSJ.requestFthId).should('exist');
  });

  it('Par numéro de dossier du père', () => {
    cy.typeAndIntercept('[data-cy="PrescriptionsSearch"]', epCHUSJ_ldmCHUSJ.mrnFth, 'POST', '**/graphql', 4*epCHUSJ_ldmCHUSJ.mrnFth.length);
    cy.waitWhileSpin(60*1000);

    cy.get('body').contains('Requêtes (1)', {timeout: 60*1000}).should('exist');
    cy.get('body').contains(epCHUSJ_ldmCHUSJ.requestFthId).should('exist');
  });

  it('Par numéro de patient du père', () => {
    cy.typeAndIntercept('[data-cy="PrescriptionsSearch"]', epCHUSJ_ldmCHUSJ.patientFthId, 'POST', '**/graphql', 4*epCHUSJ_ldmCHUSJ.patientFthId.length);
    cy.waitWhileSpin(60*1000);

    cy.get('body').contains('Requêtes (1)', {timeout: 60*1000}).should('exist');
    cy.get('body').contains(epCHUSJ_ldmCHUSJ.requestFthId).should('exist');
  });

  it('Par numéro d\'échantillon du père', () => {
    cy.typeAndIntercept('[data-cy="PrescriptionsSearch"]', epCHUSJ_ldmCHUSJ.sampleFthId, 'POST', '**/graphql', 4*epCHUSJ_ldmCHUSJ.sampleFthId.length);
    cy.waitWhileSpin(60*1000);

    cy.get('body').contains('Requêtes (1)', {timeout: 60*1000}).should('exist');
    cy.get('body').contains(epCHUSJ_ldmCHUSJ.requestFthId).should('exist');
  });
});
