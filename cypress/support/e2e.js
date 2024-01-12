/* eslint-disable */
/// <reference types="Cypress" />
import './commands';

// Ignore uncaught exception so tests doesn't stop mid run
Cypress.on('uncaught:exception', () => false);
