/// <reference types="Cypress" />
/* eslint-disable @typescript-eslint/no-unused-vars */
declare namespace Cypress {
  interface Chainable {
    checkValueFacetAndApply(facetTitle: string, value: string): cy & CyEventEmitter;
    clickAndIntercept(selector: string, methodHTTP: string, routeMatcher: string, nbCalls: number, eq?: number): cy & CyEventEmitter;
    closePopup(): cy & CyEventEmitter;
    login(): cy & CyEventEmitter;
    logout(): cy & CyEventEmitter;
    removeFilesFromFolder(folder: string): cy & CyEventEmitter;
    resetColumns(table_id?: string): cy & CyEventEmitter;
    showColumn(column: string|RegExp): cy & CyEventEmitter;
    sortTableAndIntercept(column: string|RegExp, nbCalls: number): cy & CyEventEmitter;
    sortTableAndWait(column: string): cy & CyEventEmitter;
    typeAndIntercept(selector: string, text: string, methodHTTP: string, routeMatcher: string, nbCalls: number, eq: number = 0): cy & CyEventEmitter;
    validateClearAllButton(shouldExist: boolean): cy & CyEventEmitter;
    validateFacetFilter(facetTitle: string, valueFront: string, valueBack: string, expectedCount: string|RegExp, eq: number = 0): cy & CyEventEmitter;
    validateFacetNumFilter(facetTitle: string, value: string, expectedCount: string|RegExp, isNoData: Boolean = false, eq: number = 0): cy & CyEventEmitter;
    validateFacetRank(facetRank: number, facetTitle: string): cy & CyEventEmitter;
    validateFileContent(fixture: string, replacements?: Replacement[]): cy & CyEventEmitter;
    validateFileHeaders(fixture: string): cy & CyEventEmitter;
    validateFileName(namePattern: string): cy & CyEventEmitter;
    validateOperatorSelectedQuery(expectedOperator: string): cy & CyEventEmitter;
    validatePillSelectedQuery(facetTitle: string|RegExp, values: (string|RegExp)[], eq: number = 0): cy & CyEventEmitter;
    validateTableFirstRow(expectedValue: string|RegExp, eq: number): cy & CyEventEmitter;
    validateTableResultsCount(expectedCount: string|RegExp, shouldExist: boolean = true): cy & CyEventEmitter;
    validateTotalSelectedQuery(expectedCount: string|RegExp): cy & CyEventEmitter;
    visitAndIntercept(url: string, methodHTTP: string, routeMatcher: string, nbCalls: number): cy & CyEventEmitter;
    visitCommunityPage(): cy & CyEventEmitter;
    visitDashboard(): cy & CyEventEmitter;
    visitDataExploration(tab?: string, sharedFilterOption?: string): cy & CyEventEmitter;
    visitFileEntity(fileId: string): cy & CyEventEmitter;
    visitParticipantEntity(participantId: string): cy & CyEventEmitter;
    visitProfileSettingsPage(): cy & CyEventEmitter;
    visitStudyEntity(studyId: string, nbCalls: number): cy & CyEventEmitter;
    visitStudiesPage(): cy & CyEventEmitter;
    visitVariantEntityPage(locusId: string, nbGraphqlCalls: number): cy & CyEventEmitter;
    visitVariantsPage(sharedFilterOption?: string): cy & CyEventEmitter;
    waitWhileSpin(ms: number): cy & CyEventEmitter;
  }
}