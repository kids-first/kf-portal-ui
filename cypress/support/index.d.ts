/// <reference types="cypress"/>
/* eslint-disable @typescript-eslint/no-unused-vars */
declare namespace Cypress {
  interface Chainable {
    checkValueFacetAndApply(facetTitle: string, value: string): cy & Chainable<void>;
    checkValueFacet(facetTitle: string, value: string): cy & Chainable<void>;
    clickAndIntercept(selector: string, methodHTTP: string, routeMatcher: string, nbCalls: number, beVisible: boolean = false, eq?: number): cy & Chainable<void>;
    clickAndWait(options?: Partial<ClickOptions>): Chainable<Element>;
    closePopup(): cy & Chainable<void>;
    createBioReqIfNotExists(bioreqName: string, itemPosition: number): cy & Chainable<void>;
    createFilterIfNotExists(filterName: string): cy & Chainable<void>;
    createSetIfNotExists(setName: string, itemPosition: number): cy & Chainable<void>;
    deleteBioReqIfExists(bioreqName: string): cy & Chainable<void>;
    deleteFilter(filterName: string): cy & Chainable<void>;
    deleteFilterIfExists(filterName: string): cy & Chainable<void>;
    deleteSet(dataNodeKey: string, setName: string): cy & Chainable<void>;
    deleteSetIfExists(dataNodeKey: string, setName: string): cy & Chainable<void>;
    login(): cy & Chainable<void>;
    logout(): cy & Chainable<void>;
    removeFilesFromFolder(folder: string): cy & Chainable<void>;
    resetColumns(table_id?: string): cy & Chainable<void>;
    saveBioReqAs(bioreqName: string, itemPosition: number): cy & Chainable<void>;
    saveFilterAs(filterName: string): cy & Chainable<void>;
    saveSetAs(setName: string, itemPosition: number): cy & Chainable<void>;
    selectPreset(tab: string): cy & Chainable<void>;
    showColumn(column: string|RegExp): cy & Chainable<void>;
    sortTableAndIntercept(column: string|RegExp, nbCalls: number): cy & Chainable<void>;
    sortTableAndWait(column: string): cy & Chainable<void>;
    typeAndIntercept(selector: string, text: string, methodHTTP: string, routeMatcher: string, nbCalls: number, eq: number = 0): cy & Chainable<void>;
    validateClearAllButton(shouldExist: boolean): cy & Chainable<void>;
    validateFacetFilter(facetTitle: string, valueFront: string, valueBack: string, expectedCount: string|RegExp, eq: number = 0, applyButton: boolean = true): cy & Chainable<void>;
    validateFacetNumFilter(operator: string, facetTitle: string, value: string, expectedCount: string|RegExp, isNoData: Boolean = false, eq: number = 0): cy & Chainable<void>;
    validateFacetRank(facetRank: number, facetTitle: string): cy & Chainable<void>;
    validateFileContent(fixture: string, replacements?: Replacement[]): cy & Chainable<void>;
    validateFileHeaders(fixture: string): cy & Chainable<void>;
    validateFileName(namePattern: string): cy & Chainable<void>;
    validateFilterInManager(filterName: string, expect: string): cy & Chainable<void>;
    validateIconStates(iconName: string, isDisable: boolean, isDirty: boolean): cy & Chainable<void>;
    validateOperatorSelectedQuery(expectedOperator: string): cy & Chainable<void>;
    validatePillSelectedQuery(facetTitle: string|RegExp, values: (string|RegExp)[], eq: number = 0): cy & Chainable<void>;
    validateSelectedFilterInDropdown(filterName: string): cy & Chainable<void>;
    validateTableFirstRow(expectedValue: string|RegExp, eq: number, hasCheckbox: boolean = false): cy & Chainable<void>;
    validateTableResultsCount(expectedCount: string|RegExp, shouldExist: boolean = true): cy & Chainable<void>;
    validateTotalSelectedQuery(expectedCount: string|RegExp): cy & Chainable<void>;
    validateXlsxFileContent(fixture: string, replacements?: Replacement[]): cy & Chainable<void>;
    visitAndIntercept(url: string, methodHTTP: string, routeMatcher: string, nbCalls: number): cy & Chainable<void>;
    visitCommunityPage(): cy & Chainable<void>;
    visitDashboard(): cy & Chainable<void>;
    visitDataExploration(tab?: string, sharedFilterOption?: string): cy & Chainable<void>;
    visitFileEntity(fileId: string): cy & Chainable<void>;
    visitParticipantEntity(participantId: string): cy & Chainable<void>;
    visitProfileSettingsPage(): cy & Chainable<void>;
    visitProfileViewPage(): cy & Chainable<void>;
    visitStudyEntity(studyId: string, nbCalls: number): cy & Chainable<void>;
    visitStudiesPage(): cy & Chainable<void>;
    visitVariantEntityPage(locusId: string, nbGraphqlCalls: number): cy & Chainable<void>;
    visitVariantsPage(sharedFilterOption?: string): cy & Chainable<void>;
    visitVariantsSomaticPage(sharedFilterOption?: string): cy & Chainable<void>;
    waitUntilFile(ms: number): cy & Chainable<void>;
    waitWhileSpin(ms: number): cy & Chainable<void>;
  }
}