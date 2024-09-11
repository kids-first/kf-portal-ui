/// <reference types="cypress"/>
import '../../support/commands';

beforeEach(() => {
  cy.visit('/');
});

describe('Page Landing - Vérifier les informations affichées', () => {
  it('Section Upper banner', () => {
    cy.get('[class*="TopBanner"] [class*="LoginForm_logo"]').should('exist');
    cy.get('[class*="TopBanner"] h1[class*="LandingPageTitle"]').contains('Kids First Data Resource Portal').should('exist');
    cy.get('[class*="TopBanner"] [class*="LandingPageParagraph"]').contains('Empower your research with our robust collection of childhood cancer, congenital disorder, and cross-condition data.').should('exist');
    cy.get('[class*="TopBanner"] [class*="LandingPageParagraph"]').contains('Getting started is as easy as 1-2-3').should('exist');
    cy.get('[class*="TopBanner"] [class*="LandingPageParagraph"]').contains('Sign up within minutes… free of charge!').should('exist');
    cy.get('[class*="TopBanner"] [class*="LandingPageButton_primary"]').contains('Sign up').should('exist');
    cy.get('[class*="TopBanner"] [class*="LandingPageButton_secondary"]').contains('Log in').should('exist');
  });

  it('Section Studies Side Panel Tile', () => {
    cy.get('[class*="StudiesSection_title"] h1').contains('Leading the way through data-sharing').should('exist');
    cy.get('[class*="StudiesSection"] [src*="/static/media/kf-portal-icons_studies_2."]').should('exist');
    cy.get('[class*="StudiesSection"] h2').contains(/\d{1}/).should('exist');
    cy.get('[class*="StudiesSection"] h2').contains('Studies').should('exist');
    cy.get('[class*="StudiesSection"] [class*="Studies_subtitle"]').contains('Explore a broad collection of harmonized studies focused pediatric cancer and structural birth defects for cross condition research.').should('exist');
  });

  it('Section Studies Right Panel Tile', () => {
    cy.get('[class*="Carousel_carouselContainer"] [class*="anticon-left"]').should('exist');
    cy.get('[class*="Carousel_carouselContainer"] [class*="anticon-right"]').should('exist');

    cy.get('[class*="Carousel_carouselContainer"] h4').contains('Children\'s Brain Tumor Network').should('exist');
    cy.get('[class*="Carousel_carouselContainer"] [class*="LandingPageParagraph"]').contains('The Children\'s Brain Tumor Network (CBTN) is a multi-institutional international clinical research consortium created to advance therapeutic development through the collection and rapid distribution of biospecimens and data via open-science research platforms for real-time access and use by the global research community.').should('exist');
    cy.get('[class*="Carousel_carouselContainer"] [src*="/static/media/kf-portal-icons_participants_3."]').should('exist');
    cy.get('[class*="Carousel_carouselContainer"] [class*="LandingPageParagraph_bold"]').contains(/\d{1}/).should('exist');
    cy.get('[class*="Carousel_carouselContainer"] [class*="LandingPageParagraph_small"]').contains('Participants').should('exist');

    cy.get('[class*="Carousel_carouselContainer"] h4').contains('National Heart, Lung, and Blood Institute (NHLBI) Bench to Bassinet Program: The Gabriella Miller Kids First Pediatric Research Program of the Pediatric Cardiac Genetics Consortium (PCGC)').should('exist');
    cy.get('[class*="Carousel_carouselContainer"] [class*="LandingPageParagraph"]').contains('The Pediatric Cardiac Genomics Consortium (PCGC) is a group of clinical research teams, supported by appropriate cores and research infrastructure, collaborating to identify genetic causes of human congenital heart disease and to relate genetic variants present in the congenital heart disease patient population to clinical outcomes.').should('exist');
    cy.get('[class*="Carousel_carouselContainer"] [src*="/static/media/kf-portal-icons_participants_3."]').should('exist');
    cy.get('[class*="Carousel_carouselContainer"] [class*="LandingPageParagraph_bold"]').contains(/\d{1}/).should('exist');
    cy.get('[class*="Carousel_carouselContainer"] [class*="LandingPageParagraph_small"]').contains('Participants').should('exist');
    cy.get('[class*="Carousel_carouselContainer"] [class*="Card_tag"]').contains('CANCER').should('exist');
    cy.get('[class*="Carousel_carouselContainer"] [class*="Card_tag"]').contains('CROSS CONDITION').should('exist');
    cy.get('[class*="Carousel_carouselContainer"] [class*="Card_tag"]').contains('CONGENITAL DISORDER').should('exist');

    cy.get('[class*="Carousel_carouselContainer"] h4').contains('Kids First: Genomic Analysis of Congenital Heart Defects and Acute Lymphoblastic Leukemia in Children with Down Syndrome').should('exist');
    cy.get('[class*="Carousel_carouselContainer"] [class*="LandingPageParagraph"]').contains('As part of the Kids First, INCLUDE, and TOPMed data resource platforms, this study focuses on advancing our understanding of the biological factors that may lead to both heart disease and leukemia in individuals with Down syndrome (DS).').should('exist');
    cy.get('[class*="Carousel_carouselContainer"] [src*="/static/media/kf-portal-icons_participants_3."]').should('exist');
    cy.get('[class*="Carousel_carouselContainer"] [class*="LandingPageParagraph_bold"]').contains(/\d{1}/).should('exist');
    cy.get('[class*="Carousel_carouselContainer"] [class*="LandingPageParagraph_small"]').contains('Participants').should('exist');

    cy.get('[class*="Carousel_carouselContainer"] h4').contains('Kids First: Genomic Analysis of Congenital Diaphragmatic Hernia').should('exist');
    cy.get('[class*="Carousel_carouselContainer"] [class*="LandingPageParagraph"]').contains('This study focuses on probands with congenital diaphragmatic hernia (CDH)/defects and their biological parents, enrolled as part of the DHREAMS (Diaphragmatic Hernia Research & Exploration; Advancing Molecular Science) project, with the objective of improving our understanding of the molecular genetic and phenotypic basis of CDH.').should('exist');
    cy.get('[class*="Carousel_carouselContainer"] [src*="/static/media/kf-portal-icons_participants_3."]').should('exist');
    cy.get('[class*="Carousel_carouselContainer"] [class*="LandingPageParagraph_bold"]').contains(/\d{1}/).should('exist');
    cy.get('[class*="Carousel_carouselContainer"] [class*="LandingPageParagraph_small"]').contains('Participants').should('exist');

    cy.get('[class*="Carousel_carouselContainer"] h4').contains('Kids First: Genetics at the Intersection of Childhood Cancer and Birth Defects').should('exist');
    cy.get('[class*="Carousel_carouselContainer"] [class*="LandingPageParagraph"]').contains('Samples from this study were recruited into the Center for Applied Genomics (CAG) biobank from patient visits to the Children\'s Hospital of Philadelphia (CHOP) and were selected for whole genome sequencing as part of the Gabriella Miller Kids First project. All cases selected were based on a diagnosis for a childhood onset cancer as well as a congenital anomaly.').should('exist');
    cy.get('[class*="Carousel_carouselContainer"] [src*="/static/media/kf-portal-icons_participants_3."]').should('exist');
    cy.get('[class*="Carousel_carouselContainer"] [class*="LandingPageParagraph_bold"]').contains(/\d{1}/).should('exist');
    cy.get('[class*="Carousel_carouselContainer"] [class*="LandingPageParagraph_small"]').contains('Participants').should('exist');

    cy.get('[class*="Carousel_carouselContainer"] h4').contains('Discovering the Genetic Basis of Human Neuroblastoma: A Gabriella Miller Kids First Pediatric Research Program (Kids First) Project').should('exist');
    cy.get('[class*="Carousel_carouselContainer"] [class*="LandingPageParagraph"]').contains('Children with disseminated neuroblastoma have a very high risk of treatment failure and death despite receiving intensified chemotherapy, radiation therapy and immunotherapy. This study includes comprehensive whole genome sequencing of neuroblastoma patient germline and diagnostic tumor DNAs and germline DNAs from both parents. The case series was recently collected through a Children\'s Oncology Group epidemiology clinical trial.').should('exist');
    cy.get('[class*="Carousel_carouselContainer"] [src*="/static/media/kf-portal-icons_participants_3."]').should('exist');
    cy.get('[class*="Carousel_carouselContainer"] [class*="LandingPageParagraph_bold"]').contains(/\d{1}/).should('exist');
    cy.get('[class*="Carousel_carouselContainer"] [class*="LandingPageParagraph_small"]').contains('Participants').should('exist');

    cy.get('[class*="Carousel_carouselContainer"] h4').contains('Kids First: Genetics of Structural Defects of the Kidney and Urinary Tract').should('exist');
    cy.get('[class*="Carousel_carouselContainer"] [class*="LandingPageParagraph"]').contains('Congenital defects of the kidney and urinary tract are a common cause of kidney failure in children and adults and elucidation of the genetics of these disorders will provide new opportunities for diagnosis, risk stratification and prevention of complications. Participants of this study were collected as part of the Genetics of Chronic Kidney disease study at Columbia University, which includes international collaborators.').should('exist');
    cy.get('[class*="Carousel_carouselContainer"] [src*="/static/media/kf-portal-icons_participants_3."]').should('exist');
    cy.get('[class*="Carousel_carouselContainer"] [class*="LandingPageParagraph_bold"]').contains(/\d{1}/).should('exist');
    cy.get('[class*="Carousel_carouselContainer"] [class*="LandingPageParagraph_small"]').contains('Participants').should('exist');

    cy.get('[class*="Carousel_carouselContainer"] h4').contains('Genomic Studies of Orofacial Cleft Birth Defects').should('exist');
    cy.get('[class*="Carousel_carouselContainer"] [class*="LandingPageParagraph"]').contains('Orofacial cleft birth defects (OFCs) are the most common craniofacial anomalies in humans, affecting approximately 1 in 700 newborns, and are one of the most common structural birth defects worldwide. This is a whole genome sequencing study of 415 White parent-case trios drawn from ongoing collaborations led by Dr. Mary L. Marazita of the University of Pittsburgh Center for Craniofacial and Dental Genetics, including collaborations with Dr. George Wehby of the University of Iowa, Dr. Jacqueline Hecht of the University of Texas, and Dr. Terri Beaty of Johns Hopkins University.').should('exist');
    cy.get('[class*="Carousel_carouselContainer"] [src*="/static/media/kf-portal-icons_participants_3."]').should('exist');
    cy.get('[class*="Carousel_carouselContainer"] [class*="LandingPageParagraph_bold"]').contains(/\d{1}/).should('exist');
    cy.get('[class*="Carousel_carouselContainer"] [class*="LandingPageParagraph_small"]').contains('Participants').should('exist');

    cy.get('[class*="Carousel_carouselContainer"] h4').contains('Comprehensive Genomic Profiling to Improve Prediction of Clinical Outcome for Children with T-cell Acute Lymphoblastic Leukemia').should('exist');
    cy.get('[class*="Carousel_carouselContainer"] [class*="LandingPageParagraph"]').contains('The outcome for patients with relapsed T-ALL is dismal with 3-year event free survival of <15%. Thus, the primary goal in the treatment of T-ALL is to prevent relapse, which requires accurate risk stratification. Unfortunately, no reproducibly prognostic genetic alterations independent of minimal residual disease (MRD) have been identified, making it challenging to predict relapse at diagnosis. Therefore, the Gabriella Miller Kids First T-ALL project is conducting whole genome, exome sequencing, and transcriptome profiling of tumor and germline DNA across 1350 samples.').should('exist');
    cy.get('[class*="Carousel_carouselContainer"] [src*="/static/media/kf-portal-icons_participants_3."]').should('exist');
    cy.get('[class*="Carousel_carouselContainer"] [class*="LandingPageParagraph_bold"]').contains(/\d{1}/).should('exist');
    cy.get('[class*="Carousel_carouselContainer"] [class*="LandingPageParagraph_small"]').contains('Participants').should('exist');

    cy.get('[class*="Carousel_carouselContainer"] h4').contains('Kids First: Expanded Ewing sarcoma cohort for tumor genomics and association with DNA repair deficiencies, clinical presentation, and outcome').should('exist');
    cy.get('[class*="Carousel_carouselContainer"] [class*="LandingPageParagraph"]').contains('Ewing sarcoma (EWS) is a deadly bone cancer in children and adolescents, with growing evidence suggesting a genetic predisposition, although the specific genetic factors remain unidentified. This Kids First project aims to uncover the genetic factors contributing to EWS by focusing on three key objectives: identifying cancer predisposition genes, genome-wide GGAA microsatellite repeats, and de novo mutation and structural variant rates in EWS trios reflecting underlying DNA repair defects that increase disease risk.').should('exist');
    cy.get('[class*="Carousel_carouselContainer"] [src*="/static/media/kf-portal-icons_participants_3."]').should('exist');
    cy.get('[class*="Carousel_carouselContainer"] [class*="LandingPageParagraph_bold"]').contains(/\d{1}/).should('exist');
    cy.get('[class*="Carousel_carouselContainer"] [class*="LandingPageParagraph_small"]').contains('Participants').should('exist');
  });

  it('Section Released Data Stats', () => {
    cy.get('[class*="ChartsSection_getStarted"] [class*="LandingPageTitle"]').contains('Accelerating research').should('exist');
    cy.get('[class*="ChartsSection_getStarted"] [class*="LandingPageParagraph"]').contains('Build virtual cohorts using data from over 99K samples, including whole genome sequencing (WGS) and RNA-Sequencing, is available to empower your research today.').should('exist');
    cy.get('[class*="ChartsSection_getStarted"] [class*="LandingPageButton"]').contains('Get started').should('exist');

    cy.get('[class*="Grid_statsGrid"] [class*="Grid_stats"] [class*="Grid_icon"]').eq(0).should('have.attr', 'src').and('match', /icons_studies/);
    cy.get('[class*="Grid_statsGrid"] [class*="Grid_stats"] [class*="Grid_data"]').eq(0).contains(/\d{2}/).should('exist');
    cy.get('[class*="Grid_statsGrid"] [class*="Grid_stats"] [class*="Grid_description"]').eq(0).contains('Studies').should('exist');

    cy.get('[class*="Grid_statsGrid"] [class*="Grid_stats"] [class*="Grid_icon"]').eq(1).should('have.attr', 'src').and('match', /icons_participants/);
    cy.get('[class*="Grid_statsGrid"] [class*="Grid_stats"] [class*="Grid_data"]').eq(1).contains(/(\d{2}\.\d{1}|\d{3})K/).should('exist');
    cy.get('[class*="Grid_statsGrid"] [class*="Grid_stats"] [class*="Grid_description"]').eq(1).contains('Participants').should('exist');

    cy.get('[class*="Grid_statsGrid"] [class*="Grid_stats"] [class*="Grid_icon"]').eq(2).should('have.attr', 'src').and('match', /icons_genomes/);
    cy.get('[class*="Grid_statsGrid"] [class*="Grid_stats"] [class*="Grid_data"]').eq(2).contains(/\d{2}M+/).should('exist');
    cy.get('[class*="Grid_statsGrid"] [class*="Grid_stats"] [class*="Grid_description"]').eq(2).contains('Variants').should('exist');

    cy.get('[class*="Grid_statsGrid"] [class*="Grid_stats"] [class*="Grid_icon"]').eq(3).should('have.attr', 'src').and('match', /icons_biosamples/);
    cy.get('[class*="Grid_statsGrid"] [class*="Grid_stats"] [class*="Grid_data"]').eq(3).contains(/(\d{2}\.\d{1}|\d{3})K/).should('exist');
    cy.get('[class*="Grid_statsGrid"] [class*="Grid_stats"] [class*="Grid_description"]').eq(3).contains('Biospecimens').should('exist');

    cy.get('[class*="Grid_statsGrid"] [class*="Grid_stats"] [class*="Grid_icon"]').eq(4).should('have.attr', 'src').and('match', /icons_cloud_files/);
    cy.get('[class*="Grid_statsGrid"] [class*="Grid_stats"] [class*="Grid_data"]').eq(4).contains(/\d{1}\.\d{2}PB/).should('exist');
    cy.get('[class*="Grid_statsGrid"] [class*="Grid_stats"] [class*="Grid_description"]').eq(4).contains('Files').should('exist');

    cy.get('[class*="Grid_statsGrid"] [class*="Grid_stats"] [class*="Grid_icon"]').eq(5).should('have.attr', 'src').and('match', /icons_biospecimens/);
    cy.get('[class*="Grid_statsGrid"] [class*="Grid_stats"] [class*="Grid_data"]').eq(5).contains(/\d{2}\.\d{1}K/).should('exist');
    cy.get('[class*="Grid_statsGrid"] [class*="Grid_stats"] [class*="Grid_description"]').eq(5).contains('Genomes').should('exist');
  });

  it('Section Charts 1', () => {
    cy.get('[class*="ChartsSection"] [class*="Mondo"] h4').contains('Most Frequent Diagnoses (MONDO)').should('exist');
    cy.get('[class*="ChartsSection"] [class*="Mondo"] text[style*="dominant-baseline"]').contains('Diagnoses (MONDO)').should('exist');
    cy.get('[class*="ChartsSection"] [class*="Mondo"] text[style*="dominant-baseline"]').contains('# of participants').should('exist');
    cy.get('[class*="ChartsSection"] [class*="Mondo"] text[dominant-baseline="central"]').contains('Down Syndrome').should('exist');
    cy.get('[class*="ChartsSection"] [class*="Mondo"] text[dominant-baseline="central"]').contains(/\d{1}/).should('exist');
  });

  it('Section Charts 2', () => {
    cy.get('[class*="ChartsSection"] [class*="Demographic"] h4').contains('Demographics').should('exist');
    cy.get('[class*="ChartsSection"] [class*="Demographic"] h5').eq(0).contains('Family Composition').should('exist');
    cy.get('[class*="ChartsSection"] [class*="Demographic"] h5').eq(1).contains('Race').should('exist');
    cy.get('[class*="ChartsSection"] [class*="Demographic"] h5').eq(2).contains('Ethnicity').should('exist');
  });

  it('Section External Tools', () => {
    cy.get('[class*="CollaboratorSection_title"] h1').contains('Advancing science through collaboration').should('exist');
    cy.get('[class*="CollaboratorSection_title"] h4').contains('Easily gain access to a range of robust cloud-based resources to drive meaningful research progress.').should('exist');
  });

  it('Section Variant Tile', () => {
    cy.get('[class*="CollaboratorCard_collaboratorCard__"]').eq(0).find('[class*="CollaboratorSection_logo"]').should('exist');
    cy.get('[class*="CollaboratorCard_collaboratorCard__"]').eq(0).find('h3').contains('Germline Variants').should('exist');
    cy.get('[class*="CollaboratorCard_collaboratorCard__"]').eq(0).find('[class*="LandingPageParagraph"]').contains('Our variant explorer offers advanced searching capabilities. With just a few clicks, you can explore millions of annotated germline variants from the genomes of Kids First participants.').should('exist');
    cy.get('[class*="CollaboratorCard_collaboratorCard__"]').eq(0).find('[class*="LandingPageButton_primary"]').contains('Explore variant data').should('exist');
  });

  it('Section Cavatica Tile', () => {
    cy.get('[class*="CollaboratorCard_collaboratorCard__"]').eq(1).find('[src*="cavatica-login-logo"]').should('exist');
    cy.get('[class*="CollaboratorCard_collaboratorCard__"]').eq(1).find('[class*="LandingPageParagraph"]').contains('The portal integrates with CAVATICA, a cloud-based platform designed for worldwide data analysis and collaboration. Researchers can analyze Kids First datasets using custom or pre-existing workflows.').should('exist');
    cy.get('[class*="CollaboratorCard_collaboratorCard__"]').eq(1).find('[class*="LandingPageButton_secondary"] [id*="Icon FerLab"]').should('exist');
    cy.intercept('GET', 'https://www.cavatica.org/').as('getCavatica');
    cy.get('[class*="CollaboratorCard_collaboratorCard__"]').eq(1).find('[class*="LandingPageButton_secondary"]').contains('Get started').click({force: true});
    cy.wait('@getCavatica');
  });

  it('Section PedcBioportal Tile', () => {
    cy.get('[class*="CollaboratorCard_collaboratorCard__"]').eq(2).find('[class*="CollaboratorSection_logo"]').should('exist');
    cy.get('[class*="CollaboratorCard_collaboratorCard__"]').eq(2).find('[class*="LandingPageParagraph"]').contains('A navigational tool housing clinical data sourced from patient medical visits, PedcBioPortal guides researchers and clinicians toward optimal treatment avenues to enhance the exploration of innovative therapies.').should('exist');
    cy.get('[class*="CollaboratorCard_collaboratorCard__"]').eq(2).find('[class*="LandingPageButton_secondary"] [id*="Icon FerLab"]').should('exist');
    cy.intercept('GET', '**/pedcbioportal.org/*').as('getPedcBioportal');
    cy.get('[class*="CollaboratorCard_collaboratorCard__"]').eq(2).find('[class*="LandingPageButton_secondary"]').contains('Get started').click({force: true});
    cy.wait('@getPedcBioportal');
  });

  it('Section Documentation Tiles', () => {
    cy.get('[class*="Card_footerCard"]').eq(0).find('h1').contains('Find inspiration').should('exist');
    cy.get('[class*="Card_footerCard"]').eq(0).contains('Review published work that cites Kids First, then publish findings you’ve uncovered using this powerful resource.').should('exist');
    cy.get('[class*="Card_footerCard"]').eq(0).find('[class*="LandingPageButton_secondary"] [id*="Icon FerLab"]').should('exist');
    cy.intercept('https://kidsfirstdrc.org/publications/').as('getPublications');
    cy.get('[class*="Card_footerCard"]').eq(0).find('[class*="LandingPageButton_secondary"]').contains('View publications').click({force: true});
    cy.wait('@getPublications');

    cy.visit('/');
    cy.get('[class*="Card_footerCard"]').eq(1).find('h1').contains('Get answers').should('exist');
    cy.get('[class*="Card_footerCard"]').eq(1).contains('Navigate the Kids First landscape like a pro with tips and information found at the Data Portal Help Center.').should('exist');
    cy.get('[class*="Card_footerCard"]').eq(1).find('[class*="LandingPageButton_secondary"] [id*="Icon FerLab"]').should('exist');
    cy.intercept('https://kidsfirstdrc.org/help-center/').as('getHelpCenter');
    cy.get('[class*="Card_footerCard"]').eq(1).find('[class*="LandingPageButton_secondary"]').contains('Help center').click({force: true});
    cy.wait('@getHelpCenter');
  });

  it('Section Lower banner', () => {
    cy.get('[class*="About_row"] h4').eq(0).contains('About').should('exist');
    cy.get('[class*="About_row"]').eq(0).find('[href="https://kidsfirstdrc.org/about/"]').contains('About Kids First').should('exist');
    cy.get('[class*="About_row"]').eq(0).find('[href="https://kidsfirstdrc.org/community/"]').contains('Community').should('exist');
    cy.get('[class*="About_row"]').eq(0).find('[href="https://kidsfirstdrc.org/faqs/"]').contains('FAQs').should('exist');

    cy.get('[class*="About_row"] h4').eq(1).contains('Resources').should('exist');
    cy.get('[class*="About_row"]').eq(1).find('[href="https://kidsfirstdrc.org/portal/"]').contains('Data').should('exist');
    cy.get('[class*="About_row"]').eq(1).find('[href="https://kidsfirstdrc.org/tools/"]').contains('Tools').should('exist');
    cy.get('[class*="About_row"]').eq(1).find('[href="https://kidsfirstdrc.org/help-center/"]').contains('Help Center').should('exist');

    cy.get('[class*="About_row"] h4').eq(2).contains('News').should('exist');
    cy.get('[class*="About_row"]').eq(2).find('[href="https://kidsfirstdrc.org/news/"]').contains('Articles').should('exist');
    cy.get('[class*="About_row"]').eq(2).find('[href="https://kidsfirstdrc.org/events/"]').contains('Events').should('exist');
    cy.get('[class*="About_row"]').eq(2).find('[href="https://kidsfirstdrc.org/category/press/"]').contains('Press').should('exist');

    cy.get('[class*="Socials"] [href="https://www.facebook.com/kidsfirstDRC"] [src*="/static/media/facebook-f."]').should('exist');
    cy.get('[class*="Socials"] [href="https://twitter.com/kidsfirstDRC"] [src*="/static/media/x-twitter."]').should('exist');
    cy.get('[class*="Socials"] [href="https://www.linkedin.com/company/kidsfirstdrc/"] [src*="/static/media/linkedin-in."]').should('exist');
    cy.get('[class*="Socials"] [href="https://www.instagram.com/kidsfirstdrc/"] [src*="/static/media/instagram."]').should('exist');
    cy.get('[class*="Socials"] [href="https://www.youtube.com/channel/UCK9sPu0j4_ci4m3nNFa6gVw"] [src*="/static/media/youtube."]').should('exist');
    cy.get('[class*="Socials"] [class*="LandingPageParagraph"]').contains('Follow @kidsfirstdrc').should('exist');
    cy.get('[class*="Socials"] [href="mailto:support@kidsfirstdrc.org"]').invoke('attr', 'class').and('include', 'LandingPageButton_primary').then(() => {
      cy.contains('Email kids first').should('exist');
    });
    cy.get('[class*="Socials"] [href="https://kidsfirstdrc.org/policies/#privacy"]').contains('Privacy Policy').should('exist');
    cy.get('[class*="Socials"] [href="https://kidsfirstdrc.org/policies/#cookies"]').contains('Cookies').should('exist');
  });

  it('Section Institutional logos for KF partners', () => {
    cy.get('[class*="About_about__"] h4').eq(3).contains('Kids First Partner Institutions').should('exist');
    cy.get('[class*="About_partners"] [href="https://d3b.center/"]').should('exist');
    cy.get('[class*="About_partners"] [href="https://www.chusj.org/Home"]').should('exist');
    cy.get('[class*="About_partners"] [href="https://www.unchealth.org/home"]').should('exist');
    cy.get('[class*="About_partners"] [href="https://ctds.uchicago.edu/"]').should('exist');
    cy.get('[class*="About_partners"] [href="https://velsera.com/"]').should('exist');
    cy.get('[class*="About_partners"] [href="https://medschool.vanderbilt.edu/"]').should('exist');
  });

  it('Section Disclamer', () => {
    cy.get('[class*="Footer_legals"]').contains('The Kids First Data Resource Center (“DRC”) comprises partnered institutions supported by the NIH Common Fund under Award Number U2CHL138346 as part of the Common Fund’s Gabriella Miller Kids First Pediatric Research Program (“Kids First”). All content, terms and conditions and policies associated with the DRC Portal and Website (the “Services”) are produced by the DRC. The views and opinions of authors expressed on the Services do not necessarily state or reflect those of the National Institutes of Health (“NIH”) or the U.S. government. Furthermore, the NIH does not endorse or promote any DRC entity or any of its products or services nor guarantees the products, services, or information provided by the DRC.').should('exist');
    cy.get('[class*="Footer_legals"]').contains('© 2024 Gabriella Miller Kids First Data Resource Center. All rights reserved.').should('exist');
  });
});