/// <reference types="cypress" />

describe('Monitoring installation progress', () => {
  before(() => {
    // Important
    cy.log('Prior runing these tests, make sure:');
    cy.log('  - the tests from 05.review.cy.ts passed along all their requirements.');
  });

  // TODO:
  // cluster-progress-status-value     Preparing for installation
  // #cluster-detail-button-cancel-installation
  // td[data-testid=host-status] contains Preparing for installation
});
