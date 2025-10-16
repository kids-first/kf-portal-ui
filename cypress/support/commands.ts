/// <reference types="cypress"/>
import createUUID from './createUUID';
import { oneMinute } from '../support/utils';

export interface Replacement {
  placeholder: string;
  value: string;
}

Cypress.Commands.add('checkValueFacetAndApply', (facetTitle: string, value: string) => {
  cy.get(`[aria-expanded="true"] [data-cy="FilterContainer_${facetTitle}"]`).should('exist');
  cy.waitWhileSpin(oneMinute);
  cy.get(`[data-cy="FilterContainer_${facetTitle}"]`).parentsUntil('.FilterContainer_filterContainer__8Dsbs')
    .find('button').then(($button) => {
    if ($button.hasClass('ant-btn-link')) {
      cy.get(`[data-cy="FilterContainer_${facetTitle}"]`).parentsUntil('.FilterContainer_filterContainer__8Dsbs')
        .find('button[class*="CheckboxFilter_filtersTypesFooter"]').clickAndWait({force: true});
        cy.waitWhileSpin(oneMinute);
    };
  });
 
  cy.get(`[data-cy="Checkbox_${facetTitle}_${value}"]`).check({force: true});
  cy.clickAndIntercept(`[data-cy="Apply_${facetTitle}"]`, 'POST', '**/graphql', 3);
  cy.wait(1000);
  cy.waitWhileSpin(oneMinute);
});

Cypress.Commands.add('checkValueFacet', (facetTitle: string, value: string) => {
  cy.get(`[aria-expanded="true"] [data-cy="FilterContainer_${facetTitle}"]`).should('exist');
  cy.waitWhileSpin(oneMinute);
  cy.get(`[data-cy="FilterContainer_${facetTitle}"]`).parentsUntil('.FilterContainer_filterContainer__8Dsbs')
    .find('button').then(($button) => {
    if ($button.hasClass('ant-btn-link')) {
      cy.get(`[data-cy="FilterContainer_${facetTitle}"]`).parentsUntil('.FilterContainer_filterContainer__8Dsbs')
        .find('button[class*="CheckboxFilter_filtersTypesFooter"]').clickAndWait({force: true});
        cy.waitWhileSpin(oneMinute);
      };
  });

  cy.intercept('POST', '**/graphql').as('getPOSTgraphql');
  cy.get(`[data-cy="Checkbox_${facetTitle}_${value}"]`).check({force: true});
  for (let i = 0; i < 6; i++) {
    cy.wait('@getPOSTgraphql', {timeout: oneMinute});
  };

  cy.waitWhileSpin(oneMinute);
});

Cypress.Commands.add('clickAndIntercept', (selector: string, methodHTTP: string, routeMatcher: string, nbCalls: number, beVisible: boolean = false, eq?: number) => {
  if (!eq) {
    eq = 0;
  }

  cy.intercept(methodHTTP, routeMatcher).as('getRouteMatcher');

  if (beVisible) {
    cy.get(selector).filter(':visible').eq(eq).clickAndWait({force: true});
  }
  else {
    cy.get(selector).eq(eq).clickAndWait({force: true});
  }

  for (let i = 0; i < nbCalls; i++) {
    cy.wait('@getRouteMatcher', {timeout: oneMinute});
  };

  cy.waitWhileSpin(oneMinute);
});

Cypress.Commands.add('clickAndWait', { prevSubject: 'element' }, (subject, options) => {
  cy.wrap(subject).click(options);
  cy.waitWhileSpin(oneMinute);
});

Cypress.Commands.add('closePopup', () => {
  cy.get('button').then(($button) => {
      if ($button.hasClass('close')) {
          cy.get('button[class="close"]').clickAndWait({force: true});
      };
  });
});

Cypress.Commands.add('createBioReqIfNotExists', (bioreqName: string, itemPosition: number) => {
  cy.visitDashboard();
  cy.get('[class*="DashboardCards_dashboardCard"]').each(($el: JQuery<HTMLElement>) => {
    if ($el.text().includes('Biospecimen Requests')) {
      cy.wrap($el).as('dashboardCard');
    };
  });
  cy.get('@dashboardCard').invoke('text').then((invokeText) => {
    if (!invokeText.includes(bioreqName)) {
      cy.saveBioReqAs(bioreqName, itemPosition);
    };
  });
});

Cypress.Commands.add('createFilterIfNotExists', (filterName: string) => {
  cy.get('button[class*="QueryBuilderHeaderTools_queryBuilderHeaderDdb"]').clickAndWait({force: true});
  cy.get('[class*="ant-dropdown-menu-root"]').invoke('text').then((invokeText) => {
    if (!invokeText.includes(filterName)) {
      cy.saveFilterAs(filterName);
    };
  });
});

Cypress.Commands.add('createSetIfNotExists', (setName: string, itemPosition: number) => {
  cy.get('[class*="SetSearch_search"] input').type(setName, {force: true});
  cy.get('[class*="SetSearch_search"] [class*="ant-select-dropdown"]').invoke('text').then((invokeText) => {
    if (!invokeText.includes(setName)) {
      cy.saveSetAs(setName, itemPosition);
    };
  });
});

Cypress.Commands.add('deleteBioReqIfExists', (bioreqName: string) => {
  cy.visitDashboard();
  cy.get('[class*="DashboardCards_dashboardCard"]').each(($el: JQuery<HTMLElement>) => {
    if ($el.text().includes('Biospecimen Requests')) {
      cy.wrap($el).as('dashboardCard');
    };
  });
  cy.get('@dashboardCard').invoke('text').then((invokeText) => {
    if (invokeText.includes(bioreqName)) {
      cy.get('[class*="ListItemWithActions_fuiListItemWithActions"]').each(($el: JQuery<HTMLElement>) => {
        if ($el.text().includes(bioreqName)) {
          cy.wrap($el).find('svg[data-icon="delete"]').clickAndWait({force:true});
          cy.clickAndIntercept('[class="ant-modal-content"] button[class*="ant-btn-dangerous"]', 'DELETE', '**/sets/**', 1);
        };
      });
    };
  });

  cy.get('[class*="DashboardCards_dashboardCard"]').each(($el: JQuery<HTMLElement>) => {
    if ($el.text().includes('Biospecimen Requests')) {
      cy.wrap($el).as('dashboardCard');
    };
  });
  cy.get('@dashboardCard').contains(bioreqName).should('not.exist');
});

Cypress.Commands.add('deleteFilter', (filterName: string) => {
  cy.get('[class*="ant-dropdown-menu-title-content"]').contains(filterName).clickAndWait({force: true});
  cy.get('[id="query-builder-header-tools"] [class*="Header_togglerTitle"]').contains(filterName).should('exist');
  cy.get('[id="query-builder-header-tools"] [class*="anticon-delete"]').clickAndWait({force: true});
  cy.clickAndIntercept('[class="ant-modal-content"] button[class*="ant-btn-dangerous"]', 'POST', '**/graphql', 1);

  cy.get('button[class*="QueryBuilderHeaderTools_queryBuilderHeaderDdb"]').clickAndWait({force: true});
  cy.get('[class*="ant-dropdown-menu-root"]').contains(filterName).should('not.exist');
});

Cypress.Commands.add('deleteFilterIfExists', (filterName: string) => {
  cy.get('button[class*="QueryBuilderHeaderTools_queryBuilderHeaderDdb"]').clickAndWait({force: true});
  cy.get('[class*="ant-dropdown-menu-root"]').invoke('text').then((invokeText) => {
    if (invokeText.includes(filterName)) {
      cy.deleteFilter(filterName);
    };
  });
});

Cypress.Commands.add('deleteSet', (dataNodeKey: string, setName: string) => {
  cy.visitDashboard();
  cy.get(`[class*="SavedSets_setTabs"] [data-node-key="${dataNodeKey}"]`).clickAndWait({force: true});
  cy.get('[class*="SavedSets_setTabs"] [class*="ant-tabs-tabpane-active"]').contains(setName).parentsUntil('[class*="ListItem_savedSetListItem"]').parent().find('[class*="anticon-delete"]').clickAndWait({force: true});
  cy.clickAndIntercept('[class="ant-modal-confirm-body-wrapper"] button[class*="ant-btn-dangerous"]', 'DELETE', '**/sets/**', 1);

  cy.get('[class*="SavedSets_setTabs"] [class*="ant-tabs-tabpane-active"]').contains(setName).should('not.exist');
});

Cypress.Commands.add('deleteSetIfExists', (dataNodeKey: string, setName: string) => {
  cy.visitDashboard();
  cy.get(`[class*="SavedSets_setTabs"] [data-node-key="${dataNodeKey}"]`).clickAndWait({force: true}); // data-cy="Tab_Biospecimens"
  cy.get('[class*="SavedSets_setTabs"] [class*="ant-tabs-tabpane-active"]').invoke('text').then((invokeText) => {
    if (invokeText.includes(setName)) {
      cy.deleteSet(dataNodeKey, setName);
    };
  });
});

Cypress.Commands.add('login', () => {
  cy.session(['user'], () => {
    cy.visit('/dashboard');

    cy.request({
      url: `https://keycloak-qa.kf-strides.org/realms/kidsfirstdrc/protocol/openid-connect/auth`,
      qs: {
        client_id: 'portal-ui',
        redirect_uri: Cypress.config('baseUrl'),
        kc_idp_hint: null,
        scope: 'openid',
        state: createUUID(),
        nonce: createUUID(),
        response_type: 'code',
        response_mode: 'fragment',
      },
    }).then((response) => {
      const html: HTMLElement = document.createElement('html');
      html.innerHTML = response.body;

      const script = html.getElementsByTagName('script')[0] as HTMLScriptElement;

      eval(script.textContent ?? '');

      const loginUrl: string = (window as any).kcContext.url.loginAction;

      return cy.request({
        form: true,
        method: 'POST',
        url: loginUrl,
        followRedirect: false,
        body: {
          username: Cypress.env('user_username'),
          password: Cypress.env('user_password'),
        },
      });
    });

    cy.waitWhileSpin(oneMinute);
    cy.visit('/dashboard');
 });
});

Cypress.Commands.add('logout', () => {
  cy.visit('/');
  cy.waitWhileSpin(oneMinute);

  cy.get('div').then(($div) => {
      if ($div.hasClass('App')) {
          cy.get('[data-icon="down"]').eq(1).clickAndWait({force: true});
          cy.get('[data-menu-id*="logout"]').clickAndWait({force: true});
      };
  });

  cy.waitWhileSpin(oneMinute);
});

Cypress.Commands.add('removeFilesFromFolder', (folder: string) => {
  cy.exec(`/bin/rm ${folder}/*`, {failOnNonZeroExit: false});
});

Cypress.Commands.add('resetColumns', (table_id?: string) => {
  let cySettings: Cypress.Chainable;

  if (table_id == undefined) {
    cySettings = cy.get('svg[data-icon="setting"]');
  }
  else {
    cySettings = cy.get(`div[id="${table_id}"]`).find('svg[data-icon="setting"]');
  }

  cySettings.clickAndWait({force: true});
  cy.get('button[class*="ColumnSelector_ProTablePopoverColumnResetBtn"]').clickAndWait({force: true});
  cy.get('button[class*="ColumnSelector_ProTablePopoverColumnResetBtn"]').should('be.disabled', {timeout: 20*1000});
  cySettings.clickAndWait({force: true});
  cy.get('[class*="Header_logo"]').clickAndWait({force: true});
});

Cypress.Commands.add('saveBioReqAs', (bioreqName: string, itemPosition: number) => {
  cy.visitDataExploration('biospecimens');
  cy.get('[data-cy="SidebarMenuItem_Biospecimen"]').clickAndWait({force: true});
  cy.get('[class*="Filters_filterExpandBtnWrapper"] button[class*="ant-btn-link"]').clickAndWait({force: true});
  cy.get('[class*="Filters_filterExpandBtnWrapper"] button[class*="ant-btn-link"]').contains('Collapse all').should('exist');
  cy.checkValueFacetAndApply('Sample Availability', 'available');
  cy.get('div[role="tabpanel"] [class*="ant-table-row"], [class="ant-table-body"] [class*="ant-table-row"]').eq(itemPosition).find('[type="checkbox"]').check({force: true});
  cy.get('button').each(($el: JQuery<HTMLElement>) => {
    if ($el.text().includes('Request biospecimen')) {
      cy.wrap($el).as('button');
    };
  });
  cy.get('@button').clickAndWait({force: true});
  cy.get('[class*="requestBiospecimen_modalWrapper"] input').clear();
  cy.get('[class*="requestBiospecimen_modalWrapper"] input').type(bioreqName);
  cy.clickAndIntercept('[class="ant-modal-content"] button[class*="ant-btn-primary"]', 'POST', '** /biospecimen-request', 1);

  cy.get('[class*="requestBiospecimen_modalWrapper"]').should('not.exist');
});

Cypress.Commands.add('saveFilterAs', (filterName: string) => {
  cy.get('button[class*="Header_iconBtnAction"]').clickAndWait({force: true});
  cy.wait(1000);
  cy.get('[class="ant-modal-content"] input').clear().type(filterName);
  cy.get(`[class="ant-modal-content"] input[value="`+filterName+`"]`).should('exist');
  cy.clickAndIntercept('[class="ant-modal-content"] button[class*="ant-btn-primary"]', 'POST', '**/saved-filters', 1);

  cy.get('[id="query-builder-header-tools"] [class*="Header_togglerTitle"]').contains(filterName).should('exist');
});

Cypress.Commands.add('saveSetAs', (setName: string, itemPosition: number) => {
  cy.get('div[role="tabpanel"] [class*="ant-table-row"], [class="ant-table-body"] [class*="ant-table-row"]').eq(itemPosition).find('[type="checkbox"]').check({force: true});
  cy.get('[id*="-set-dropdown-container"] button').clickAndWait({force: true});
  cy.get('[data-menu-id*="-create"]').clickAndWait({force: true});
  cy.get('form[id="save-set"] input').clear();
  cy.get('form[id="save-set"] input').type(setName);
  cy.clickAndIntercept('[class="ant-modal-content"] button[class*="ant-btn-primary"]', 'POST', '**/sets', 1);

  cy.get('form[id="save-set"]').should('not.exist');
});

Cypress.Commands.add('selectPreset', (tab: string) => {
  const strTitle = tab === 'datafiles' ? 'Data Files' : 'Imaging';
  cy.get('svg[data-icon="setting"]').clickAndWait({force: true});
  cy.get('[class*="ColumnSelectorHeader_presetSelectorContainer"] [class="ant-select-selector"]').clickAndWait({force: true});
  cy.get(`[class*="ant-select-dropdown"] [title="${strTitle}"]`).clickAndWait({force: true});
});

Cypress.Commands.add('showColumn', (column: string|RegExp) => {
  cy.intercept('PUT', '**/user').as('getPOSTuser');

  cy.get('div[class="ant-popover-inner"]')
    .find('div[class="ant-space-item"]').contains(column)
    .find('[type="checkbox"]').check({force: true});
  cy.wait('@getPOSTuser', {timeout: oneMinute});
  cy.get('[class*="Header_logo"]').clickAndWait({force: true});
  cy.waitWhileSpin(oneMinute);
});

Cypress.Commands.add('sortTableAndIntercept', (column: string|RegExp, nbCalls: number) => {
  cy.intercept('POST', '**/graphql').as('getPOSTgraphql');

  cy.get('thead[class="ant-table-thead"]').contains(column).scrollIntoView().clickAndWait({force: true});

  for (let i = 0; i < nbCalls; i++) {
    cy.wait('@getPOSTgraphql', {timeout: oneMinute});
  };

  cy.waitWhileSpin(oneMinute);
});

Cypress.Commands.add('sortTableAndWait', (column: string) => {
  cy.get('thead[class="ant-table-thead"]').contains(column).clickAndWait({force: true});
  cy.wait(1000);
});

Cypress.Commands.add('typeAndIntercept', (selector: string, text: string, methodHTTP: string, routeMatcher: string, nbCalls: number, eq: number = 0) => {
  cy.intercept(methodHTTP, routeMatcher).as('getRouteMatcher');

  cy.get(selector).find('input').eq(eq).type(text, {force: true});

  for (let i = 0; i < nbCalls; i++) {
    cy.wait('@getRouteMatcher', {timeout: oneMinute});
  };

  cy.waitWhileSpin(oneMinute);
});

Cypress.Commands.add('validateClearAllButton', (shouldExist: boolean) => {
  const strExist = shouldExist ? 'exist' : 'not.exist';
  cy.get('[id="query-builder-header-tools"]').contains('Clear all').should(strExist);
});

Cypress.Commands.add('validateFacetFilter', (facetTitle: string, valueFront: string, valueBack: string, expectedCount: string|RegExp, eq: number = 0, applyButton: boolean = true) => {
  if (applyButton) {
    cy.checkValueFacetAndApply(facetTitle, valueBack);
    cy.validatePillSelectedQuery(facetTitle, [valueFront], eq);
  }
  else {
    cy.checkValueFacet(facetTitle, valueBack);
  }

  cy.validateTableResultsCount(expectedCount);
});

Cypress.Commands.add('validateFacetNumFilter', (operator: string, facetTitle: string, value: string, expectedCount: string|RegExp, isNoData: Boolean = false, eq: number = 0) => {
  cy.wait(2000);
  if (operator === 'MinMax') {
    cy.get(`[data-cy="InputNumber_Min_${facetTitle}"]`).type(value, {force: true});
    cy.get(`[data-cy="InputNumber_Max_${facetTitle}"]`).type(value, {force: true});
  }
  else {
    cy.get(`[data-cy="InputNumber_${operator}_${facetTitle}"]`).type(value, {force: true});
  }
  if (isNoData) {
    cy.get(`[data-cy="Checkbox_NoData_${facetTitle}"]`).check({force: true});
  }
  cy.get(`[data-cy="Button_Apply_${facetTitle}"]`).clickAndWait({force: true});

  if (isNoData) {
    cy.validatePillSelectedQuery(facetTitle, [value, 'No Data'], eq);
  }
  else {
    cy.validatePillSelectedQuery(facetTitle, [value], eq);
  }
  cy.get('body').contains(expectedCount).should('exist');
});

Cypress.Commands.add('validateFacetRank', (facetRank: number, facetTitle: string) => {
  cy.get('div[class*="Filter_facetCollapse"], div[class*="Filters_customFilterContainer"]').eq(facetRank).contains(facetTitle).should('exist');
});

Cypress.Commands.add('validateFileContent', (fixture: string, replacements?: Replacement[]) => {
  const arrReplacements = replacements !== undefined ? replacements : [];
  cy.fixture(fixture).then((expectedData) => {
    cy.exec(`/bin/ls ${Cypress.config('downloadsFolder')}/*`).then((result) => {
      const filename = result.stdout.trim();
      cy.readFile(`${filename}`).then((file) => {
        let fileWithData = file;
        arrReplacements.forEach((replacement) => {
          fileWithData = fileWithData.replace(replacement.placeholder, replacement.value);
        });
        expectedData.content.forEach((value: any) => {
          let valueWithData = value
          arrReplacements.forEach((replacement) => {
            valueWithData = valueWithData.replace(replacement.placeholder, replacement.value);
          });
          assert.include(fileWithData, valueWithData);
        });
      });
    });
  });
});

Cypress.Commands.add('validateFileHeaders', (fixture: string) => {
  cy.fixture(fixture).then((expectedData) => {
    cy.exec(`/bin/ls ${Cypress.config('downloadsFolder')}/*`).then((result) => {
      const filename = result.stdout.trim();
      cy.readFile(`${filename}`).then((file) => {
        expectedData.headers.forEach((header: any) => {
          assert.include(file, header);
        });
      });
    });
  });
});

Cypress.Commands.add('validateFileName', (namePattern: string) => {
  cy.exec(`/bin/ls ${Cypress.config('downloadsFolder')}/`+namePattern).then((result) => {
    const filename = result.stdout.trim();
    cy.readFile(`${filename}`).should('exist');
  });
});

Cypress.Commands.add('validateFilterInManager', (filterName: string, expect: string) => {
  cy.get('button[class*="QueryBuilderHeaderTools_queryBuilderHeaderDdb"]').clickAndWait({force: true});
  cy.get('[data-menu-id*="manage-my-filters"]').clickAndWait({force: true});
  cy.get('[class="ant-modal-content"]').contains(filterName).should(expect);
  cy.get('button[class="ant-modal-close"]').invoke('click');
});

Cypress.Commands.add('validateIconStates', (iconName: string, isDisable: boolean, isDirty: boolean) => {
  const strShouldDisable = isDisable ? 'be.disabled' : 'not.be.disabled';
  const strShouldDirty = isDirty ? 'have.class' : 'not.have.class';
  cy.get(`[id="query-builder-header-tools"] [data-icon="`+iconName+`"]`).parentsUntil('button').parent().should(strShouldDisable)
  cy.get(`[id="query-builder-header-tools"] [data-icon="`+iconName+`"]`).parentsUntil('button').parent().should(strShouldDirty, 'dirty');
});

Cypress.Commands.add('validateOperatorSelectedQuery', (expectedOperator: string) => {
  cy.get('[class*="QueryBar_selected"] [class*="Combiner_operator"]').contains(expectedOperator).should('exist');
});

Cypress.Commands.add('validatePillSelectedQuery', (facetTitle: string|RegExp, values: (string|RegExp)[], eq: number = 0) => {
  if (facetTitle == '') {
    cy.get('[class*="QueryBar_selected"] [class*="QueryPill_field"]').should('not.exist');
  }
  else {
    cy.get('[class*="QueryBar_selected"] [class*="QueryPill_field"]').eq(eq).contains(facetTitle).should('exist');
  }

  for (let i = 0; i < values.length; i++) {
    cy.get('[class*="QueryBar_selected"] [class*="QueryValues_queryValuesContainer"]').eq(eq).contains(values[i]).should('exist');
    }
});

Cypress.Commands.add('validateSelectedFilterInDropdown', (filterName: string) => {
  cy.get('button[class*="QueryBuilderHeaderTools_queryBuilderHeaderDdb"]').clickAndWait({force: true});
  cy.get('[class*="ant-dropdown-menu-item-selected"]').contains(filterName).should('exist');
});

Cypress.Commands.add('validateTableFirstRow', (expectedValue: string|RegExp, eq: number, hasCheckbox: boolean = false) => {
  cy.wait(1000);
  cy.get('tr[class*="ant-table-row"]').eq(0)
  .then(($firstRow) => {
    cy.wrap($firstRow).find('td').eq(eq).contains(expectedValue).should('exist');
    if (hasCheckbox) {
      cy.wrap($firstRow).find('[type="checkbox"]').check({force: true});
      cy.wrap($firstRow).find('[type="checkbox"]').should('be.checked');
      cy.wrap($firstRow).find('[type="checkbox"]').uncheck({force: true});
    };
  });
});

Cypress.Commands.add('validateTableResultsCount', (expectedCount: string|RegExp, shouldExist: boolean = true) => {
  const strExist = shouldExist ? 'exist' : 'not.exist';
  cy.waitWhileSpin(oneMinute);
  cy.get('div[class*="ProTableHeader"]').contains(expectedCount).should(strExist);
});

Cypress.Commands.add('validateTotalSelectedQuery', (expectedCount: string|RegExp) => {
  cy.waitWhileSpin(oneMinute);
  cy.get('[class*="QueryBar_selected"] [class*="QueryBar_total"]').contains(expectedCount).should('exist');
});

Cypress.Commands.add('validateXlsxFileContent', (fixture: string, replacements?: Replacement[]) => {
  const arrReplacements = replacements !== undefined ? replacements : [];
  cy.fixture(fixture).then((expectedData) => {
    cy.exec(`/bin/ls ${Cypress.config('downloadsFolder')}/*.xlsx`).then((result) => {
      const filename = result.stdout.trim();
      cy.task('extractTextFromXLSX', filename).then((file) => {
        let fileWithData = typeof file === 'string' ? file : '';
        arrReplacements.forEach((replacement) => {
          fileWithData = fileWithData.replace(replacement.placeholder, replacement.value);
        });
        expectedData.content.forEach((value: any) => {
          let valueWithData = value;
          arrReplacements.forEach((replacement) => {
            valueWithData = valueWithData.replace(replacement.placeholder, replacement.value);
          });
          assert.include(fileWithData, valueWithData);
        });
      });
    });
  });
});

Cypress.Commands.add('visitAndIntercept', (url: string, methodHTTP: string, routeMatcher: string, nbCalls: number) => {
  cy.intercept(methodHTTP, routeMatcher).as('getRouteMatcher');

  cy.visit(url);

  for (let i = 0; i < nbCalls; i++) {
    cy.wait('@getRouteMatcher', {timeout: oneMinute});
  };

  cy.waitWhileSpin(oneMinute);
});

Cypress.Commands.add('visitCommunityPage', () => {
  cy.visit('/community');
  cy.waitWhileSpin(oneMinute);
  cy.get('[class*="CommunityPage_title"]'); // data-cy="Title_Community"
});

Cypress.Commands.add('visitDashboard', () => {
  cy.visit('/dashboard');
  cy.waitWhileSpin(oneMinute);
  cy.get('[class*="Dashboard_greeting"]'); // data-cy="Title_Dashboard"
  cy.waitWhileSpin(oneMinute);
});

Cypress.Commands.add('visitDataExploration', (tab?: string, sharedFilterOption?: string) => {
  const strTab = tab === 'imaging' ? 'datafiles' : (tab !== undefined ? tab : '');
  const strSharedFilterOption = sharedFilterOption !== undefined ? sharedFilterOption : '';
  
  cy.visitAndIntercept(`/data-exploration/${strTab}${strSharedFilterOption}`,
                       'POST',
                       '**/graphql',
                       10);

  if (strTab === 'datafiles') {
    cy.selectPreset(tab !== undefined ? tab : '');
  };
  
  if (tab !== undefined) {
    cy.resetColumns();
  };
  
});

Cypress.Commands.add('visitFileEntity', (fileId: string) => {
  cy.visitAndIntercept(`/files/${fileId}`,
                       'POST',
                       '**/graphql',
                       1);
});

Cypress.Commands.add('visitParticipantEntity', (participantId: string) => {
  cy.visitAndIntercept(`/participants/${participantId}`,
                       'POST',
                       '**/graphql',
                       5);
});

Cypress.Commands.add('visitProfileSettingsPage', () => {
  cy.visit('/profile/settings');
  cy.waitWhileSpin(oneMinute);
  cy.get('[class*="Settings_profileSettingsHeader"]'); //data-cy="Title_ProfileSettings"
});

Cypress.Commands.add('visitProfileViewPage', () => {
  cy.visit('/profile/view');
  cy.get('[class*="CommunityMemberProfilePage_avatarContainer"]').should('exist'); // data-cy="AvatarHeader"
  cy.waitWhileSpin(oneMinute);
});

Cypress.Commands.add('visitStudyEntity', (studyId: string, nbCalls: number) => {
  cy.visitAndIntercept(`/studies/${studyId}`,
                       'POST',
                       '**/graphql',
                       nbCalls);
});

Cypress.Commands.add('visitStudiesPage', () => {
  cy.visitAndIntercept('/studies',
                       'POST',
                       '**/graphql',
                       6);
  cy.resetColumns();
});

Cypress.Commands.add('visitVariantEntityPage', (locusId: string, nbGraphqlCalls: number) => {
  cy.visitAndIntercept(`/variants/${locusId}`,
                       'POST',
                       '**/graphql',
                       nbGraphqlCalls);
});

Cypress.Commands.add('visitVariantsPage', (sharedFilterOption?: string) => {
  const strSharedFilterOption = sharedFilterOption !== undefined ? sharedFilterOption : '';
  cy.visitAndIntercept(`/variants${strSharedFilterOption}`,
                       'POST',
                       '**/graphql',
                       4);
  cy.resetColumns();
});

Cypress.Commands.add('visitVariantsSomaticPage', (sharedFilterOption?: string) => {
  const strSharedFilterOption = sharedFilterOption !== undefined ? sharedFilterOption : '';
  cy.visitAndIntercept(`/variants-somatic${strSharedFilterOption}`,
                       'POST',
                       '**/graphql',
                       4);
  cy.resetColumns();
});

Cypress.Commands.add('waitUntilFile', (ms: number) => {
  const start = new Date().getTime();

  function checkFile(): any {
    const now = new Date().getTime();
    if (now - start > ms) {
      throw new Error(`Timed out after ${ms}ms waiting for file`);
    }

    return cy.task('fileExists', `${Cypress.config('downloadsFolder')}`).then((exists) => {
      if (exists) {
        return true;
      } else {
        return cy.wait(500).then(checkFile);
      }
    });
  }

  return checkFile();
});

Cypress.Commands.add('waitWhileSpin', (ms: number) => {
  const start = new Date().getTime();

  function checkForSpinners():any {
    const now = new Date().getTime();
    if (now - start > ms) {
      throw new Error(`Timed out after ${ms}ms waiting for spinners to disappear`);
    };

    return cy.get('body').then(($body) => {
      if ($body.find('.ant-spin-blur').length > 0) {
        return cy.wait(1000).then(checkForSpinners);
      };
    });
  };

  return checkForSpinners();
});

Cypress.Commands.overwrite('log', (subject, message) => cy.task('log', message));