/// <reference types="cypress"/>
import '../../support/commands';

describe('Navigation', () => {

  beforeEach(() => {
    cy.login();
  });

  it('Boutons de la header', () => {
    cy.visitDashboard();
    cy.get('[class*="Dashboard_greeting"]').should('exist'); // data-cy="Title_Dashboard"

    cy.get('button[class*="HeaderLink_headerBtn"]').eq(1).clickAndWait(); // data-cy="HeaderLink_Studies"
    cy.get('[class*="PageContent_title"]').contains('Studies').should('exist'); // data-cy="Title_Studies"

    cy.get('button[class*="HeaderLink_headerBtn"]').eq(2).clickAndWait(); // data-cy="HeaderLink_Data Exploration"
    cy.get('[class*="PageContent_title"]').contains('Data Exploration').should('exist'); // data-cy="Title_DataExploration"

    cy.get('button[class*="HeaderLink_headerBtn"]').eq(3).clickAndWait(); // data-cy="HeaderLink_Variants"
    cy.get('[class*="PageContent_pageHeaderTitle"]').contains('Variants Exploration').should('exist'); // data-cy="Title_Variants"

    cy.get('button[class*="HeaderLink_headerBtn"]').eq(4).clickAndWait(); // data-cy="HeaderLink_Community"
    cy.get('[class*="CommunityPage_title"]').should('exist'); // data-cy="Title_Community"

    cy.get('[class*="Header_userName"]').clickAndWait({force: true}); // data-cy="UserName"
    cy.get('[data-menu-id*="profile_settings"]').find('[href]').clickAndWait({force: true});
    cy.get('[class*="Settings_profileSettingsHeader"]').should('exist'); // data-cy="Title_ProfileSettings"
  });

  it('Lien externe des resources - Website', () => {
    cy.visitDashboard();
    cy.window().then((win) => {
      cy.stub(win, 'open').as('windowOpen');
    });

    cy.get('[class*="Header_resources_"]').clickAndWait({force: true}); // data-cy="Menu_Website"
    cy.get('[data-menu-id*="website"]').find('[href]').clickAndWait({force: true}); // data-cy="MenuLink_Website"
    cy.get("@windowOpen").should('be.calledWith', 'https://kidsfirstdrc.org/');
  });

  it('Lien externe des resources - Documentation', () => {
    cy.visitDashboard();
    cy.window().then((win) => {
      cy.stub(win, 'open').as('windowOpen');
    });

    cy.get('[class*="Header_resources_"]').clickAndWait({force: true}); // data-cy="Menu_Documentation"
    cy.get('[data-menu-id*="documentation"]').find('[href]').clickAndWait({force: true}); // data-cy="MenuLink_Documentation"
    cy.get("@windowOpen").should('be.calledWith', 'https://kidsfirstdrc.org/help-center/');
  });

  it('Lien externe des resources - Contact', () => {
    cy.visitDashboard();
    cy.window().then((win) => {
      cy.stub(win, 'open').as('windowOpen');
    });

    cy.get('[class*="Header_resources_"]').clickAndWait({force: true}); // data-cy="Menu_Contact"
    cy.get('[data-menu-id*="contact"]').find('[href]').clickAndWait({force: true}); // data-cy="MenuLink_Contact"
    cy.get("@windowOpen").should("be.calledWith", "mailto:support@kidsfirstdrc.org");
  });

  it('Redirections de la page Dashboard', () => {
    cy.visitDashboard();
    cy.get('[class*="LinkBox_dataExploBox"]').eq(0).clickAndWait({force: true}); // data-cy="GridCard_Studies"
    cy.get('[class*="PageContent_title"]').contains('Studies').should('exist'); // data-cy="Title_Studies"

    cy.visitDashboard();
    cy.get('[class*="LinkBox_dataExploBox"]').eq(1).clickAndWait({force: true}); // data-cy="GridCard_Participants"
    cy.get('[class*="Participants_participantTabWrapper"]').should('exist'); // data-cy="ProTable_Participants"

    cy.visitDashboard();
    cy.get('[class*="LinkBox_dataExploBox"]').eq(3).clickAndWait({force: true}); // data-cy="GridCard_Biospecimens"
    cy.get('[class*="Biospecimens_biospecimenTabWrapper"]').should('exist'); // data-cy="ProTable_Biospecimens"

    cy.visitDashboard();
    cy.get('[class*="LinkBox_dataExploBox"]').eq(4).clickAndWait({force: true}); // data-cy="GridCard_DataFiles"
    cy.get('[class*="DataFiles_dataFilesTabWrapper"]').should('exist'); // data-cy="ProTable_DataFiles"
  });

  it('Modals de la page Dashboard', () => {
    cy.visitDashboard();
    cy.get('[class*="ListItem_savedSetListItem"]').find('svg[data-icon="edit"]').eq(0).clickAndWait({force: true}); // data-cy="SavedSets"
    cy.contains('Edit set').should('exist');
    cy.get('button[class="ant-modal-close"]').invoke('click');

    cy.visitDashboard();
    cy.get('[class*="ListItem_savedSetListItem"]').find('svg[data-icon="delete"]').eq(0).clickAndWait({force: true}); // data-cy="SavedSets"
    cy.contains('Permanently delete this set?').should('exist');
    cy.get('button[type="button"]').contains('Cancel').clickAndWait({force: true});

    cy.visitDashboard();
    cy.get('[class*="SavedFilters_setTabs"]').find('svg[data-icon="edit"]').eq(0).clickAndWait({force: true}); // data-cy="SavedFilters"
    cy.contains('Edit filter').should('exist');
    cy.get('button[class="ant-modal-close"]').invoke('click');

    cy.visitDashboard();
    cy.get('[class*="SavedFilters_setTabs"]').find('svg[data-icon="delete"]').eq(0).clickAndWait({force: true}); // data-cy="SavedFilters"
    cy.contains('Permanently delete this filter?').should('exist');
    cy.get('button[type="button"]').contains('Cancel').clickAndWait({force: true});
  });

  it('Onglets de la page Data Exploration', () => {
    cy.visitDataExploration();
    cy.get('[aria-label="Demographics"]').should('exist');

    cy.get('[role="tablist"] [data-node-key="participants"]').clickAndWait({force: true}); // data-cy="Tab_Participants"
    cy.get('[class*="Participants_participantTabWrapper"]').should('exist'); // data-cy="ProTable_Participants"

    cy.get('[role="tablist"] [data-node-key="biospecimens"]').clickAndWait({force: true}); // data-cy="Tab_Biospecimens"
    cy.get('[class*="Biospecimens_biospecimenTabWrapper"]').should('exist'); // data-cy="ProTable_Biospecimens"

    cy.get('[role="tablist"] [data-node-key="datafiles"]').clickAndWait({force: true}); // data-cy="Tab_DataFiles"
    cy.get('[class*="DataFiles_dataFilesTabWrapper"]').should('exist'); // data-cy="ProTable_DataFiles"
  });

  it('Modals de la page Data Exploration', () => {
    cy.visitDataExploration();

    // Facettes
    cy.get('[data-cy="SidebarMenuItem_Participant"]').clickAndWait({force: true});

    cy.get('button[class*="UploadIdsButton"]').clickAndWait({force: true});
    cy.get('[class="ant-modal-header"]').contains('participant').should('exist');
    cy.get('button[class="ant-modal-close"]').invoke('click');

    cy.get('[data-cy="SidebarMenuItem_Clinical"]').clickAndWait({force: true});

    cy.get('div[class*="Filters_filter"]').contains('Observed Phenotype (HPO)').clickAndWait({force: true});
    cy.get('[class*="ant-modal-header"]').contains('Observed Phenotype (HPO) Browser').should('exist'); // data-cy="TreeFacet_Modal_hpoTree"
    cy.get('button[class="ant-modal-close"]').invoke('click');

    cy.get('div[class*="Filters_filter"]').contains('Diagnosis (MONDO)').clickAndWait({force: true});
    cy.get('[class*="ant-modal-header"]').contains('Diagnosis (MONDO) Browser').should('exist'); // data-cy="TreeFacet_Modal_mondoTree"
    cy.get('button[class="ant-modal-close"]').invoke('click');

    cy.get('[data-cy="SidebarMenuItem_Biospecimen"]').clickAndWait({force: true});

    cy.get('button[class*="UploadIdsButton"]').clickAndWait({force: true});
    cy.get('[class="ant-modal-header"]').contains('sample').should('exist');
    cy.get('button[class="ant-modal-close"]').invoke('click');

    cy.get('[data-cy="SidebarMenuItem_Data File"]').clickAndWait({force: true});

    cy.get('button[class*="UploadIdsButton"]').clickAndWait({force: true});
    cy.get('[class="ant-modal-header"]').contains('file').should('exist');
    cy.get('button[class="ant-modal-close"]').invoke('click');

    // Query Builder
    cy.get('button[class*="Header_iconBtnAction"]').clickAndWait({force: true});
    cy.contains('Save this filter').should('exist');
    cy.get('button[class="ant-modal-close"]').invoke('click');

    // Manage my filters
    cy.get('button[class*="QueryBuilderHeaderTools_queryBuilderHeaderDdb"]').clickAndWait({force: true});
    cy.get('[data-menu-id*="manage-my-filters"]').clickAndWait({force: true});
    cy.contains('Manage filters').should('exist');
    cy.contains('Close').should('exist');
    cy.get('button[class="ant-modal-close"]').invoke('click');

    // Onglet Data Files
    cy.visitDataExploration('datafiles');
    cy.get('[class*="ant-table-row"]').eq(0).find('input[type="checkbox"]').check({force: true});
  });
 
  it('Modals de la page des variants', () => {
    cy.visitVariantsPage();
    cy.get('[data-cy="SidebarMenuItem_Gene"]').clickAndWait({force: true});

    cy.get('button[class*="UploadIdsButton"]').clickAndWait({force: true});
    cy.get('[class="ant-modal-header"]').contains('gene').should('exist');
    cy.get('button[class="ant-modal-close"]').invoke('click');

    cy.get('button[class*="Header_iconBtnAction"]').clickAndWait({force: true});
    cy.contains('Save this filter').should('exist');
    cy.get('button[class="ant-modal-close"]').invoke('click');
  });
 
  it('Modals de la page d\'un fichier', () => {
    cy.visitFileEntity('GF_MM26B6YJ');

    cy.get('[data-icon="cloud-upload"]').clickAndWait({force: true});
    cy.contains(/(Connect to Cavatica|Analyze in Cavatica)/).should('exist');
    cy.get('button[class*="ant-btn-default"]').invoke('click');
  });
 
  it('Liens de la page Profile', () => {
    cy.visitProfileViewPage();
    cy.get('button[class*="ant-btn-primary"]').clickAndWait({force: true}); // data-cy="EditProfileButton"
    cy.get('[class*="Settings_profileSettingsHeader"]').should('exist'); // data-cy="Title_ProfileSettings"

    cy.get('[class*="Settings_profileSettingsHeader"] button').clickAndWait({force: true}); // data-cy="ViewProfileButton"
    cy.get('button[class*="CommunityMemberProfilePage_communityBtn"]').clickAndWait({force: true}); // data-cy="CommunityButton"
    cy.get('[class*="CommunityPage_title"]').should('exist'); // data-cy="Title_Community"
  });
 
  it('Liens de la page Community', () => {
    cy.visitCommunityPage();
    cy.get('[class*="MemberCard_memberLink"]').eq(0).clickAndWait({force: true}); // data-cy="MemberCard"
    cy.get('[class*="CommunityMemberProfilePage_avatarContainer"]').should('exist'); // data-cy="AvatarHeader"
  });

});
