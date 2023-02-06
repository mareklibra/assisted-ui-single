/// <reference types="cypress" />

import { CLUSTER_DOMAIN, CLUSTER_NAME, STANDARD_WAITING_TIME } from '../support/constants';

describe('Host Discovery Page', () => {
  before(() => {
    // Important
    cy.log('Prior runing these tests, make sure:');
    cy.log(
      "  - the 'creates cluster' test case from 01.homepage.cy.ts passed and so we have a cluster to build upon.",
    );
  });

  it('renders Host Discovery step and can basically navigate', () => {
    cy.visit('/');
    cy.get('.pf-c-wizard__nav-link.pf-m-current').contains('Host discovery');
    cy.get('h2').contains('Host discovery');
    cy.url().should('not.contain', '/new'); // We must be in the Edit flow now.

    cy.log('Navigation buttons should not be disabled');
    cy.get('.pf-c-page__main').scrollTo('bottom');
    cy.get('button[name="next"]').contains('Next').should('not.be.disabled');
    cy.get('button[name="back"]').contains('Back').should('not.be.disabled');
    cy.get('button[name="cancel"]').contains('Cancel').should('not.be.disabled');

    cy.log('The Cancel button leads to the Host discovery page (eventually reset changes)');
    cy.get('button[name="cancel"]').click();
    cy.wait(STANDARD_WAITING_TIME);
    cy.get('.pf-c-wizard__nav-link.pf-m-current').contains('Host discovery');
    cy.get('h2').contains('Host discovery');
    cy.url().should('not.contain', '/new'); // We must be in the Edit flow now.
    cy.get('.pf-c-page__main').scrollTo('bottom');
    cy.get('button[name="next"]').contains('Next').should('not.be.disabled');
    cy.get('button[name="back"]').contains('Back').should('not.be.disabled');
    cy.get('button[name="cancel"]').contains('Cancel').should('not.be.disabled');

    cy.log('Back buton should lead to the Homepage');
    cy.get('button[name="back"]').click();
    cy.get('h2').contains('Cluster details');
    cy.url().should('not.contain', '/new'); // Anyway, we should stay in the Edit flow and not "/new"

    cy.log('Relevant data should be prefilled on the Cluster details page');
    cy.get('#form-input-name-field').should('have.value', CLUSTER_NAME);
    cy.get('#form-input-baseDnsDomain-field').should('have.value', CLUSTER_DOMAIN);
    cy.get('#form-input-baseDnsDomain-field-helper > strong').contains(
      `${CLUSTER_NAME}.${CLUSTER_DOMAIN}`,
    );
    cy.get('#form-static-openshiftVersion-field').contains('Openshift '); // part of the OCP version name, in a static text

    cy.log('There should newly be Cluster Events button');
    cy.get('.pf-c-page__main').scrollTo('bottom');
    cy.get('#cluster-events-button').contains('View Cluster Events').click();
    cy.get('.events-modal__event-list').contains(
      "Cluster validation 'sufficient-masters-count' is now fixed",
    ); // One of the expected events to be listed
    // TODO: implement validation of components in the View Cluster Events modal
    cy.get('.pf-c-modal-box__footer > button').contains('Close').click();
    cy.get('.events-modal__event-list').should('not.exist');

    cy.log('We can go Next from the page');
    cy.get('button[name="next"]').contains('Next').should('not.be.disabled');
    cy.get('button[name="cancel"]').contains('Cancel').should('not.be.disabled');
    cy.get('button[name="next"]').click();
    cy.get('.pf-c-wizard__nav-link.pf-m-current').contains('Host discovery');
    cy.get('h2').contains('Host discovery');
  });

  it('contains expected components', () => {
    cy.visit('/');
    cy.get('.pf-c-wizard__nav-link.pf-m-current').contains('Host discovery');
    cy.get('h2').contains('Host discovery');
    cy.url().should('not.contain', '/new'); // We must be in the Edit flow now.

    cy.get('label[for=form-input-schedulableMasters-field]').contains(
      'Run workloads on control plane nodes',
    );

    cy.log('Information & Troubleshooting alert should be present');
    cy.get('#alert-information-troubleshooting').contains('Information & Troubleshooting');
    cy.get(
      '#alert-information-troubleshooting #alert-information-troubleshooting__link-hwrequirements',
    ).contains('Minimum hardware requirements');
    cy.get('#alert-information-troubleshooting #link-host-troubleshooting').contains(
      'Hosts not showing up?',
    );
    cy.get('#alert-information-troubleshooting__link-hwrequirements').click();
    cy.get('#alert-information-troubleshooting__modal-hwrequirements').contains(
      'Control plane nodes: At least 4 CPU cores, 16.00 GiB RAM, and 120 GB disk size.',
    );
    cy.get('#alert-information-troubleshooting__modal-hwrequirements').contains(
      'Workers: At least 2 CPU cores, 8.00 GiB RAM, and 120 GB disk size.',
    );
    cy.get('#alert-information-troubleshooting__modal-hwrequirements__button-close')
      .contains('Close')
      .click();
    cy.get('#link-host-troubleshooting').contains('Hosts not showing up?').click();
    // TODO: implement validation of the Troubleshooting modal, it's content should be different for the single-cluster flow
    cy.get('#modal-host-troubleshooting__button-close').click();

    // TODO: Extend following to variable amount of hosts.
    // Should it be fully dynamic (so the test will decide what is there)? Reusing #hosts-count element?
    // Or do we reuse env variables like NUM_MASTERS from dev-scripts or similar?
    cy.log('Host Inventory section - as a prerequisite, the hosts should be discovered already');
    cy.get('h3').contains('Host Inventory');
    cy.get('tr[data-testid=host-row-0] > td[data-testid=host-name]').contains('master-0');
    cy.get('tr[data-testid=host-row-0] > td[data-testid=host-hw-status]').contains('Ready');
    cy.get('tr[data-testid=host-row-0] > td[data-testid=host-name] > button').click();
    cy.get('.pf-c-modal-box__title-text').contains('Change hostname');
    cy.get('#form-input-hostname-field').should('have.value', 'master-0'); // input box
    cy.get('#change-hostname-form__button-cancel').click();
    cy.get('tr[data-testid=host-row-2] > td[data-testid=host-name]').contains('master-1');
    cy.get('tr[data-testid=host-row-2] > td[data-testid=host-hw-status]').contains('Ready');
    cy.get('tr[data-testid=host-row-4] > td[data-testid=host-name]').contains('master-2');
    cy.get('tr[data-testid=host-row-4] > td[data-testid=host-hw-status]').contains('Ready');

    cy.log('Going Next to Storage');
    cy.get('button[name="next"]').contains('Next').click();
    cy.get('.pf-c-wizard__nav-link.pf-m-current').contains('Storage');
    cy.get('h2').contains('Storage');
    cy.url().should('not.contain', '/new'); // We must be in the Edit flow now.
  });
});
