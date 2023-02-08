/// <reference types="cypress" />

import { LONG_WAITING_TIME, STANDARD_WAITING_TIME } from '../support/constants';

describe('Storage Page', () => {
  before(() => {
    // Important
    cy.log('Prior runing these tests, make sure:');
    cy.log(
      "  - the 'creates cluster' test case from 01.homepage.cy.ts passed and so we have a cluster to build upon.",
    );
  });

  it('renders Storage step and can basically navigate', () => {
    cy.visit('/');
    cy.get('.pf-c-wizard__nav-link.pf-m-current').contains('Host discovery');
    cy.get('h2').contains('Host discovery');
    cy.url().should('not.contain', '/new'); // We must be in the Edit flow now.

    cy.log('Navigation buttons on Host discovery page should not be disabled');
    cy.get('.pf-c-page__main').scrollTo('bottom');
    cy.get('button[name="next"]')
      .contains('Next')
      .should('not.be.disabled', { timeout: LONG_WAITING_TIME });
    cy.get('button[name="back"]').contains('Back').should('not.be.disabled');
    cy.get('button[name="cancel"]').contains('Cancel').should('not.be.disabled');

    cy.log('Next to Storage');
    cy.get('button[name="next"]').click();
    cy.get('.pf-c-wizard__nav-link.pf-m-current').contains('Storage');
    cy.get('h2').contains('Storage');
    cy.url().should('not.contain', '/new'); // We must be in the Edit flow

    cy.log('Back to Host discovery from Storage');
    cy.get('.pf-c-page__main').scrollTo('bottom');
    cy.get('button[name="next"]')
      .contains('Next')
      .should('not.be.disabled', { timeout: LONG_WAITING_TIME });
    cy.get('button[name="back"]').contains('Back').should('not.be.disabled');
    cy.get('button[name="cancel"]').contains('Cancel').should('not.be.disabled');
    cy.get('button[name="back"]').click();
    cy.get('h2').contains('Host discovery');
    cy.get('.pf-c-wizard__nav-link.pf-m-current').contains('Host discovery');
    cy.get('.pf-c-page__main').scrollTo('bottom');
    cy.get('button[name="next"]').click();
    cy.get('.pf-c-wizard__nav-link.pf-m-current').contains('Storage');
    cy.get('h2').contains('Storage');

    cy.log('Cancel on the Storage page leads to Host discovery');
    cy.get('.pf-c-page__main').scrollTo('bottom');
    cy.get('button[name="cancel"]').click();
    cy.wait(STANDARD_WAITING_TIME);
    cy.get('h2').contains('Host discovery');
    cy.get('.pf-c-wizard__nav-link.pf-m-current').contains('Host discovery');
    cy.get('.pf-c-page__main').scrollTo('bottom');
    cy.get('button[name="next"]').click();
    cy.get('.pf-c-wizard__nav-link.pf-m-current').contains('Storage');
    cy.get('h2').contains('Storage');

    cy.log('There should be Cluster Events button');
    cy.get('.pf-c-page__main').scrollTo('bottom');
    cy.get('#cluster-events-button').contains('View Cluster Events').click();
    cy.get('.events-modal__event-list').contains('set as bootstrap'); // One of the expected events to be listed
    // No need to test content - let's do it in the Host-discovery tests
    cy.get('.pf-c-modal-box__footer > button').contains('Close').click();
    cy.get('.events-modal__event-list').should('not.exist');
  });

  it('contains expected components', () => {
    cy.visit('/');
    cy.get('.pf-c-wizard__nav-link.pf-m-current').contains('Host discovery');
    cy.get('h2').contains('Host discovery');
    cy.url().should('not.contain', '/new');

    cy.log('Next to Storage');
    cy.get('button[name="next"]').click();
    cy.get('.pf-c-wizard__nav-link.pf-m-current').contains('Storage');
    cy.get('h2').contains('Storage');

    cy.get('#hosts-count').contains(/\([0-9]+\)/); // a number in parentheses (n)

    // TODO: Extend following to variable amount of hosts.
    cy.get('tr[data-testid=host-row-0] > td[data-testid=host-name]').contains('master-0');
    cy.get('tr[data-testid=host-row-0] > td[data-testid=host-hw-status]').contains('Ready');
    cy.get('tr[data-testid=host-row-0] > td[data-testid=host-disks]').contains('GB'); // fragile but the dev-scripts recently do not go to higher units
    cy.get('tr[data-testid=host-row-0] > td[data-testid=host-name] > button').click();
    cy.get('.pf-c-modal-box__title-text').contains('Change hostname');
    cy.get('#form-input-hostname-field').should('have.value', 'master-0'); // input box
    cy.get('button[data-testid=change-hostname-form__button-cancel]').click();
    cy.get('tr[data-testid=host-row-2] > td[data-testid=host-name]').contains('master-1');
    cy.get('tr[data-testid=host-row-2] > td[data-testid=host-hw-status]').contains('Ready');
    cy.get('tr[data-testid=host-row-4] > td[data-testid=host-name]').contains('master-2');
    cy.get('tr[data-testid=host-row-4] > td[data-testid=host-hw-status]').contains('Ready');

    cy.get('div[data-testid=alert-format-bootable-disks]').contains(
      'All bootable disks will be formatted during installation.',
    );

    cy.log('Going Next to Networking');
    cy.get('button[name="next"]').contains('Next').click();
    cy.get('.pf-c-wizard__nav-link.pf-m-current').contains('Networking');
    cy.get('h2').contains('Networking');
    cy.url().should('not.contain', '/new'); // We must be in the Edit flow now.
  });
});
