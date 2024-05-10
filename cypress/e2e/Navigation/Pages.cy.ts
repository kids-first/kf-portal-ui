/// <reference types="Cypress" />
import '../../support/commands';

describe('Navigation', () => {

  beforeEach(() => {
    cy.login();
  });

  it('Boutons de la header', () => {
    cy.visitDashboard();
    cy.get('[class*="Dashboard_greeting"]').should('exist'); // data-cy="Title_Dashboard"

    cy.get('button[class*="HeaderLink_headerBtn"]').eq(1).click(); // data-cy="HeaderLink_Studies"
    cy.get('[class*="PageContent_title"]').contains('Studies').should('exist'); // data-cy="Title_Studies"

    cy.get('button[class*="HeaderLink_headerBtn"]').eq(2).click(); // data-cy="HeaderLink_Data Exploration"
    cy.get('[class*="PageContent_title"]').contains('Data Exploration').should('exist'); // data-cy="Title_DataExploration"

    cy.get('button[class*="HeaderLink_headerBtn"]').eq(3).click(); // data-cy="HeaderLink_Variants"
    cy.get('[class*="PageContent_pageHeaderTitle"]').contains('Variants Exploration').should('exist'); // data-cy="Title_Variants"

    cy.get('button[class*="HeaderLink_headerBtn"]').eq(4).click(); // data-cy="HeaderLink_Community"
    cy.get('[class*="Community_title"]').should('exist'); // data-cy="Title_Community"

    cy.get('[class*="Header_userName"]').click({force: true}); // data-cy="UserName"
    cy.get('[data-menu-id*="profile_settings"]').find('[href]').click({force: true});
    cy.get('[class*="Settings_profileSettingsHeader"]').should('exist'); // data-cy="Title_ProfileSettings"
  });

  it('Lien externe des resources - Website', () => {
    cy.visitDashboard();
    cy.window().then((win) => {
      cy.stub(win, 'open').as('windowOpen');
    });

    cy.get('[class*="Header_resources_"]').click({force: true}); // data-cy="Menu_Website"
    cy.get('[data-menu-id*="website"]').find('[href]').click({force: true}); // data-cy="MenuLink_Website"
    cy.get("@windowOpen").should('be.calledWith', 'https://kidsfirstdrc.org/');
  });

  it('Lien externe des resources - Documentation', () => {
    cy.visitDashboard();
    cy.window().then((win) => {
      cy.stub(win, 'open').as('windowOpen');
    });

    cy.get('[class*="Header_resources_"]').click({force: true}); // data-cy="Menu_Documentation"
    cy.get('[data-menu-id*="documentation"]').find('[href]').click({force: true}); // data-cy="MenuLink_Documentation"
    cy.get("@windowOpen").should('be.calledWith', 'https://kidsfirstdrc.org/help-center/');
  });

  it('Lien externe des resources - Contact', () => {
    cy.visitDashboard();
    cy.window().then((win) => {
      cy.stub(win, 'open').as('windowOpen');
    });

    cy.get('[class*="Header_resources_"]').click({force: true}); // data-cy="Menu_Contact"
    cy.get('[data-menu-id*="contact"]').find('[href]').click({force: true}); // data-cy="MenuLink_Contact"
    cy.get("@windowOpen").should("be.calledWith", "mailto:support@kidsfirstdrc.org");
  });

  it('Redirections de la page Dashboard', () => {
    cy.visitDashboard();
    cy.get('[class*="LinkBox_dataExploBox"]').eq(0).click({force: true}); // data-cy="GridCard_Studies"
    cy.get('[class*="PageContent_title"]').contains('Studies').should('exist'); // data-cy="Title_Studies"

    cy.visitDashboard();
    cy.get('[class*="LinkBox_dataExploBox"]').eq(1).click({force: true}); // data-cy="GridCard_Participants"
    cy.get('[class*="Participants_participantTabWrapper"]').should('exist'); // data-cy="ProTable_Participants"

    cy.visitDashboard();
    cy.get('[class*="LinkBox_dataExploBox"]').eq(3).click({force: true}); // data-cy="GridCard_Biospecimens"
    cy.get('[class*="Biospecimens_biospecimenTabWrapper"]').should('exist'); // data-cy="ProTable_Biospecimens"

    cy.visitDashboard();
    cy.get('[class*="LinkBox_dataExploBox"]').eq(4).click({force: true}); // data-cy="GridCard_DataFiles"
    cy.get('[class*="DataFiles_dataFilesTabWrapper"]').should('exist'); // data-cy="ProTable_DataFiles"
  });

  it('Liens Saved Sets de la page Dashboard', () => {
    cy.visitDashboard();
    cy.get('[class*="SavedSets_setTabs"]').contains('Cypress Participants').click({force: true}); // data-cy="SavedSets"
    cy.get('[class*="Participants_participantTabWrapper"]').should('exist'); // data-cy="ProTable_Participants"
    cy.get('[class*="QueryBar_selected"]').find('[class*="QueryPill_field"]').contains('Participant ID').should('exist');
    cy.get('[class*="QueryBar_selected"]').find('[class*="QueryValues_value"]').contains('Cypress Participants').should('exist');

    cy.visitDashboard();
    cy.get('[class*="SavedSets_setTabs"] [data-node-key="biospecimen"]').click({force: true}); // data-cy="Tab_Biospecimens"
    cy.get('[class*="SavedSets_setTabs"]').contains('Cypress Biospecimens').click({force: true}); // data-cy="SavedSets"
    cy.get('[class*="Biospecimens_biospecimenTabWrapper"]').should('exist'); // data-cy="ProTable_Biospecimens"
    cy.get('[class*="QueryBar_selected"]').find('[class*="QueryPill_field"]').contains('Sample ID').should('exist');
    cy.get('[class*="QueryBar_selected"]').find('[class*="QueryValues_value"]').contains('Cypress Biospecimens').should('exist');

    cy.visitDashboard();
    cy.get('[class*="SavedSets_setTabs"] [data-node-key="files"]').click({force: true}); // data-cy="Tab_Files"
    cy.get('[class*="SavedSets_setTabs"]').contains('Cypress Data Files').click({force: true}); // data-cy="SavedSets"
    cy.get('[class*="DataFiles_dataFilesTabWrapper"]').should('exist'); // data-cy="ProTable_DataFiles"
    cy.get('[class*="QueryBar_selected"]').find('[class*="QueryPill_field"]').contains('File ID').should('exist');
    cy.get('[class*="QueryBar_selected"]').find('[class*="QueryValues_value"]').contains('Cypress Data Files').should('exist');

    cy.visitDashboard();
    cy.get('[class*="SavedSets_setTabs"] [data-node-key="variants"]').click({force: true}); // data-cy="Tab_Variants"
    cy.get('[class*="SavedSets_setTabs"]').contains('Cypress Variants').click({force: true}); // data-cy="SavedSets"
    cy.get('[class*="VariantsTable_variantTabWrapper"]').should('exist'); // data-cy="ProTable_Variants"
    cy.get('[class*="QueryBar_selected"]').find('[class*="QueryPill_field"]').contains('Variant ID').should('exist');
    cy.get('[class*="QueryBar_selected"]').find('[class*="QueryValues_value"]').contains('Cypress Variants').should('exist');
  });

  it('Liens Saved Filters de la page Dashboard', () => {
    cy.visitDashboard();
    cy.get('[class*="SavedFilters_setTabs"]').contains('Cypress Sex Filter').click({force: true}); // data-cy="SavedFilters"
    cy.get('[class*="PageContent_title"]').contains('Data Exploration').should('exist'); // data-cy="Title_DataExploration"
    cy.get('[class*="QueryBar_selected"]').find('[class*="QueryPill_field"]').contains('Sex').should('exist');
    cy.get('[class*="QueryBar_selected"]').find('[class*="QueryValues_value"]').contains('Female').should('exist');

    cy.visitDashboard();
    cy.get('[class*="SavedFilters_setTabs"] [data-node-key*="variants"]').click({force: true}); // data-cy="Tab_Variants"
    cy.get('[class*="SavedFilters_setTabs"]').contains('Cypress Variant Type Filter').click({force: true}); // data-cy="SavedFilters"
    cy.get('[class*="PageContent_pageHeaderTitle"]').should('exist'); // data-cy="Title_Variants"
    cy.get('[class*="QueryBar_selected"]').find('[class*="QueryPill_field"]').contains('Variant Type').should('exist');
    cy.get('[class*="QueryBar_selected"]').find('[class*="QueryValues_value"]').contains('SNV').should('exist');
  });

  it('Modals de la page Dashboard', () => {
    cy.visitDashboard();
    cy.get('[class*="ListItem_savedSetListItem"]').find('svg[data-icon="edit"]').eq(0).click({force: true}); // data-cy="SavedSets"
    cy.contains('Edit set').should('exist');
    cy.get('button[class="ant-modal-close"]').invoke('click');

    cy.visitDashboard();
    cy.get('[class*="ListItem_savedSetListItem"]').find('svg[data-icon="delete"]').eq(0).click({force: true}); // data-cy="SavedSets"
    cy.contains('Permanently delete this set?').should('exist');
    cy.get('button[type="button"]').contains('Cancel').click({force: true});

    cy.visitDashboard();
    cy.get('[class*="SavedFilters_setTabs"]').find('svg[data-icon="edit"]').eq(0).click({force: true}); // data-cy="SavedFilters"
    cy.contains('Edit filter').should('exist');
    cy.get('button[class="ant-modal-close"]').invoke('click');

    cy.visitDashboard();
    cy.get('[class*="SavedFilters_setTabs"]').find('svg[data-icon="delete"]').eq(0).click({force: true}); // data-cy="SavedFilters"
    cy.contains('Permanently delete this filter?').should('exist');
    cy.get('button[type="button"]').contains('Cancel').click({force: true});
  });

  it('Onglets de la page Data Exploration', () => {
    cy.visitDataExploration();
    cy.get('[aria-label="Demographics"]').should('exist');

    cy.get('[role="tablist"] [data-node-key="participants"]').click({force: true}); // data-cy="Tab_Participants"
    cy.get('[class*="Participants_participantTabWrapper"]').should('exist'); // data-cy="ProTable_Participants"

    cy.get('[role="tablist"] [data-node-key="biospecimens"]').click({force: true}); // data-cy="Tab_Biospecimens"
    cy.get('[class*="Biospecimens_biospecimenTabWrapper"]').should('exist'); // data-cy="ProTable_Biospecimens"

    cy.get('[role="tablist"] [data-node-key="datafiles"]').click({force: true}); // data-cy="Tab_DataFiles"
    cy.get('[class*="DataFiles_dataFilesTabWrapper"]').should('exist'); // data-cy="ProTable_DataFiles"
  });

  it('Modals de la page Data Exploration', () => {
    cy.visitDataExploration();

    // Facettes
    cy.get('[data-cy="SidebarMenuItem_Participant"]').click({force: true});

    cy.get('button[class*="UploadIdsButton"]').click({force: true});
    cy.get('[class="ant-modal-header"]').contains('participant').should('exist');
    cy.get('button[class="ant-modal-close"]').invoke('click');

    cy.get('[data-cy="SidebarMenuItem_Clinical"]').click({force: true});

    cy.get('div[class*="Filters_filter"]').contains('Observed Phenotype (HPO)').click({force: true});
    cy.get('[class*="ant-modal-header"]').contains('Observed Phenotype (HPO) Browser').should('exist'); // data-cy="TreeFacet_Modal_hpoTree"
    cy.get('button[class="ant-modal-close"]').invoke('click');

    cy.get('div[class*="Filters_filter"]').contains('Diagnosis (MONDO)').click({force: true});
    cy.get('[class*="ant-modal-header"]').contains('Diagnosis (MONDO) Browser').should('exist'); // data-cy="TreeFacet_Modal_mondoTree"
    cy.get('button[class="ant-modal-close"]').invoke('click');

    cy.get('[data-cy="SidebarMenuItem_Biospecimen"]').click({force: true});

    cy.get('button[class*="UploadIdsButton"]').click({force: true});
    cy.get('[class="ant-modal-header"]').contains('sample').should('exist');
    cy.get('button[class="ant-modal-close"]').invoke('click');

    cy.get('[data-cy="SidebarMenuItem_Data File"]').click({force: true});

    cy.get('button[class*="UploadIdsButton"]').click({force: true});
    cy.get('[class="ant-modal-header"]').contains('file').should('exist');
    cy.get('button[class="ant-modal-close"]').invoke('click');

    // Query Builder
    cy.get('button[class*="Header_iconBtnAction"]').click({force: true});
    cy.contains('Save this filter').should('exist');
    cy.get('button[class="ant-modal-close"]').invoke('click');

    // Manage my filters
    cy.get('button[class*="QueryBuilderHeaderTools_queryBuilderHeaderDdb"]').click({force: true});
    cy.get('[data-menu-id*="manage-my-filters"]').click({force: true});
    cy.contains('Manage filters').should('exist', {timeout: 20*1000});
    cy.contains('Close').should('exist', {timeout: 20*1000});
    cy.get('button[class="ant-modal-close"]').invoke('click');

    // Onglet Data Files
    cy.visitDataExploration('datafiles');
    cy.get('[class*="ant-table-row"]').eq(0).find('input[type="checkbox"]').check({force: true});
  });
 
  it('Modals de la page des variants', () => {
    cy.visitVariantsPage();
    cy.get('[data-cy="SidebarMenuItem_Gene"]').click({force: true});

    cy.get('button[class*="UploadIdsButton"]').click({force: true});
    cy.get('[class="ant-modal-header"]').contains('gene').should('exist');
    cy.get('button[class="ant-modal-close"]').invoke('click');

    cy.get('button[class*="Header_iconBtnAction"]').click({force: true});
    cy.contains('Save this filter').should('exist');
    cy.get('button[class="ant-modal-close"]').invoke('click');
  });
 
  it('Modals de la page d\'un fichier', () => {
    cy.visitFileEntity('GF_MM26B6YJ');

    cy.get('[data-icon="cloud-upload"]').click({force: true});
    cy.contains(/(You are not connected to Cavatica|Analyze in Cavatica)/).should('exist');
    cy.get('button[class*="ant-btn-default"]').invoke('click');
  });
 
  it('Liens de la page Profile', () => {
    cy.visitProfileSettingsPage();
    cy.get('[class*="Settings_profileSettingsHeader"] button').click({force: true}); // data-cy="ViewProfileButton"
    cy.get('[class*="ComunityProfile_avatarContainer"]').should('exist'); // data-cy="AvatarHeader"
    cy.wait(1000);

    cy.get('[class*="ComunityProfile_bannerActions"]').find('[href]').eq(1).click({force: true}); // data-cy="EditProfileButton"
    cy.get('[class*="Settings_profileSettingsHeader"]').should('exist'); // data-cy="Title_ProfileSettings"

    cy.get('[class*="Settings_profileSettingsHeader"] button').click({force: true}); // data-cy="ViewProfileButton"
    cy.get('[class*="ComunityProfile_bannerActions"]').find('[href]').eq(0).click({force: true}); // data-cy="CommunityButton"
    cy.get('[class*="Community_title"]').should('exist'); // data-cy="Title_Community"
  });
 
  it('Liens de la page Community', () => {
    cy.visitCommunityPage();
    cy.get('[class*="MemberCard_memberLink"]').eq(0).click({force: true}); // data-cy="MemberCard"
    cy.get('[class*="ComunityProfile_avatarContainer"]').should('exist'); // data-cy="AvatarHeader"
  });

});
