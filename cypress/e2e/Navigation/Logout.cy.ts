/// <reference types="cypress"/>
import '../../support/commands';

describe('Page Logout', () => {

  beforeEach(() => {
    cy.login();
    cy.visit('/');
  });

  it('Vérifier les informations affichées', () => {
    cy.logout();

    cy.get('[class*="TopBanner"] h1[class*="LandingPageTitle"]').contains('Kids First Data Resource Portal').should('exist');
    cy.get('[class*="StudiesSection_title"] h1').contains('Leading the way through data-sharing').should('exist');
    cy.get('[class*="Carousel_carouselContainer"] h4').contains('Children\'s Brain Tumor Network').should('exist');
    cy.get('[class*="Carousel_carouselContainer"] h4').contains('National Heart, Lung, and Blood Institute (NHLBI) Bench to Bassinet Program: The Gabriella Miller Kids First Pediatric Research Program of the Pediatric Cardiac Genetics Consortium (PCGC)').should('exist');
    cy.get('[class*="Carousel_carouselContainer"] h4').contains('Kids First: Genomic Analysis of Congenital Heart Defects and Acute Lymphoblastic Leukemia in Children with Down Syndrome').should('exist');
    cy.get('[class*="Carousel_carouselContainer"] h4').contains('Kids First: Genomic Analysis of Congenital Diaphragmatic Hernia').should('exist');
    cy.get('[class*="Carousel_carouselContainer"] h4').contains('Kids First: Genetics at the Intersection of Childhood Cancer and Birth Defects').should('exist');
    cy.get('[class*="Carousel_carouselContainer"] h4').contains('Discovering the Genetic Basis of Human Neuroblastoma: A Gabriella Miller Kids First Pediatric Research Program (Kids First) Project').should('exist');
    cy.get('[class*="Carousel_carouselContainer"] h4').contains('Kids First: Genetics of Structural Defects of the Kidney and Urinary Tract').should('exist');
    cy.get('[class*="Carousel_carouselContainer"] h4').contains('Genomic Studies of Orofacial Cleft Birth Defects').should('exist');
    cy.get('[class*="Carousel_carouselContainer"] h4').contains('Comprehensive Genomic Profiling to Improve Prediction of Clinical Outcome for Children with T-cell Acute Lymphoblastic Leukemia').should('exist');
    cy.get('[class*="Carousel_carouselContainer"] h4').contains('Kids First: Expanded Ewing sarcoma cohort for tumor genomics and association with DNA repair deficiencies, clinical presentation, and outcome').should('exist');
    cy.get('[class*="ChartsSection_getStarted"] [class*="LandingPageTitle"]').contains('Accelerating research').should('exist');
    cy.get('[class*="ChartsSection"] [class*="Mondo"] h4').contains('Most Frequent Diagnoses (MONDO)').should('exist');
    cy.get('[class*="ChartsSection"] [class*="Demographic"] h4').contains('Demographics').should('exist');
    cy.get('[class*="CollaboratorSection_title"] h1').contains('Advancing science through collaboration').should('exist');
    cy.get('[class*="CollaboratorCard_collaboratorCard__"]').eq(0).find('h3').contains('Germline Variants').should('exist');
    cy.get('[class*="CollaboratorCard_collaboratorCard__"]').eq(1).find('[src*="cavatica-login-logo"]').should('exist');
    cy.get('[class*="CollaboratorCard_collaboratorCard__"]').eq(2).find('[class*="CollaboratorSection_logo"]').should('exist');
    cy.get('[class*="Card_footerCard"]').eq(0).find('h1').contains('Find inspiration').should('exist');
    cy.get('[class*="Card_footerCard"]').eq(1).find('h1').contains('Get answers').should('exist');
    cy.get('[class*="About_row"] h4').eq(0).contains('About').should('exist');
    cy.get('[class*="About_row"] h4').eq(1).contains('Resources').should('exist');
    cy.get('[class*="About_row"] h4').eq(2).contains('News').should('exist');
    cy.get('[class*="Socials"] [class*="LandingPageParagraph"]').contains('Follow @kidsfirstdrc').should('exist');
    cy.get('[class*="About_about__"] h4').eq(3).contains('Kids First Partner Institutions').should('exist');
    cy.get('[class*="Footer_legals"]').contains('© 2024 Gabriella Miller Kids First Data Resource Center. All rights reserved.').should('exist');
  });
});
