/// <reference types="cypress" />
/*
  Order of the tests is important since we use them to modify assisted-service DB prior 02.*.cy.ts and later tests.
  See comments bellow.
*/

import { CLUSTER_DOMAIN, CLUSTER_NAME } from '../support/constants';
import { getPullSecret, isSkipCreateCluster } from '../support/utils';

describe('Homepage', () => {
  let pullSecret: string;

  before(() => {
    const ps = getPullSecret();
    if (typeof ps === 'string') {
      pullSecret = ps;
    } else {
      ps.then((content) => {
        pullSecret = JSON.stringify(content);
      });
    }
  });

  it('can be loaded', () => {
    cy.visit('/');

    if (isSkipCreateCluster()) {
      cy.log(
        'The CYPRESS_SKIP_CREATE_CLUSTER env variable is set to "yes", we expect an assisted-service cluster to be already created.',
      );
      cy.url().should('not.contain', '/new');
      cy.get('h2').contains('Host discovery');
      cy.get('button[name="back"]').contains('Back').should('not.be.disabled').click();
      cy.get('h2').contains('Cluster details');
      cy.get('.pf-c-page__main').scrollTo('bottom');
      cy.get('button[name="next"]').contains('Next').should('not.be.disabled');
    } else {
      cy.log(
        'The CYPRESS_SKIP_CREATE_CLUSTER env variable is not set, we expect the list of clusters in assisted-service to be empty.',
      );
      cy.url().should('contain', '/new');
      cy.get('h2').contains('Cluster details');
      cy.get('.pf-c-page__main').scrollTo('bottom');
      cy.get('button[name="next"]').contains('Next').should('be.disabled');
    }
  });

  it('contains expected components', () => {
    cy.visit('/');

    if (isSkipCreateCluster()) {
      cy.log(
        "The CYPRESS_SKIP_CREATE_CLUSTER env variable is set to 'yes', we expect an assisted-service cluster to be already created and so the furst page in the flow is Host discovery, let's go Back first.",
      );
      cy.url().should('not.contain', '/new');
      cy.get('h2').contains('Host discovery');
      cy.get('button[name="back"]').contains('Back').should('not.be.disabled').click();
      cy.get('h2').contains('Cluster details');
      cy.get('.pf-c-page__main').scrollTo('bottom');
      cy.get('button[name="next"]').contains('Next').should('not.be.disabled');
    }

    cy.get('h2').contains('Cluster details');

    // left-side navigation
    cy.get('.pf-c-wizard__nav-link.pf-m-current').contains('Cluster details');
    cy.get('.pf-c-wizard__nav-list > :nth-child(2)').contains('Host discovery');
    cy.get('.pf-c-wizard__nav-list > :nth-child(3)').contains('Storage');
    cy.get('.pf-c-wizard__nav-list > :nth-child(4)').contains('Networking');
    cy.get('.pf-c-wizard__nav-list > :nth-child(5)').contains('Review and create');

    // All fields
    cy.get('label[for=form-input-name-field]').contains('Cluster name');
    cy.get('label[for=form-input-name-field] > .pf-c-form__label-required');
    cy.get('input[id=form-input-name-field]');

    cy.get('label[for=form-input-baseDnsDomain-field]').contains('Base domain');
    cy.get('label[for=form-input-baseDnsDomain-field] > .pf-c-form__label-required');
    cy.get('input[id=form-input-baseDnsDomain-field]');
    cy.get('div[id=form-input-baseDnsDomain-field-helper]').contains(
      'All DNS records must be subdomains',
    );
    if (isSkipCreateCluster()) {
      cy.get('#form-input-baseDnsDomain-field-helper > strong').contains(
        `${CLUSTER_NAME}.${CLUSTER_DOMAIN}`,
      );
    } else {
      cy.get('div[id=form-input-baseDnsDomain-field-helper] > strong').contains(
        '[Cluster Name].[example.com]',
      );
    }
    if (isSkipCreateCluster()) {
      cy.log('Test for OCP version dropdown field skipped');
    } else {
      cy.get('label[for=form-input-openshiftVersion-field]').contains('OpenShift version');
      cy.get('div[id=form-input-openshiftVersion-field] > button');
      cy.get(
        'div[id=form-input-openshiftVersion-field] > button > .pf-c-dropdown__toggle-text',
      ).contains('OpenShift'); // testing for part of the OCP image name. One must be present.
    }

    // scroll to move visible area
    cy.get('.pf-c-page__main').scrollTo('bottom');

    if (isSkipCreateCluster()) {
      cy.log('Test for pull-secret field skipped');
    } else {
      cy.get('label[for=form-input-pullSecret-field]').contains('Pull secret');
      cy.get('label[for=form-input-pullSecret-field] > .pf-c-form__label-required');
      cy.get('textarea[id=form-input-pullSecret-field');
    }

    cy.get('label[for=form-input-enableDiskEncryptionOnMasters-field]').contains(
      'Control plane nodes',
    );
    cy.get('span[id=form-input-enableDiskEncryptionOnMasters-field-on]');
    cy.get('span[id=form-input-enableDiskEncryptionOnWorkers-field-on]');

    // Encryption warning
    cy.get('div[data-testid=alert-tpmv2-bios]').should('not.exist');

    // Bottom
    if (isSkipCreateCluster()) {
      cy.get('button[name="next"]').contains('Next').should('not.be.disabled');
    } else {
      cy.get('button[name="next"]').contains('Next').should('be.disabled');
    }
    cy.get('button[name="cancel"]').contains('Cancel').should('not.be.disabled');
  });

  // Important:
  // Following test case modifies assisted-service database, recently clean-up is not implemented.
  // The tests in 02.*.cy.ts and later require this step to pass before their execution.
  it('creates a cluster (ireversible)', () => {
    if (isSkipCreateCluster()) {
      cy.log('Skipping the test');
      return;
    }

    // Prerequisities
    expect(pullSecret).not.to.be.empty;
    cy.visit('/');
    cy.get('h2').contains('Cluster details');
    cy.url().should('contain', '/new'); // We can not be in the Edit flow. Clear DB otherwise.

    // Test
    cy.get('.pf-c-page__main').scrollTo('bottom');
    cy.get('button[name="next"]').contains('Next').should('be.disabled');
    cy.get('button[name="cancel"]').contains('Cancel').should('not.be.disabled');
    cy.get('.pf-c-page__main').scrollTo('top');

    cy.get('input[id=form-input-name-field]').type(CLUSTER_NAME);
    cy.get('input[id=form-input-baseDnsDomain-field]').type(CLUSTER_DOMAIN);

    cy.get('textarea[id=form-input-pullSecret-field').type(pullSecret, {
      parseSpecialCharSequences: false,
    });

    cy.get('#form-input-enableDiskEncryptionOnMasters-field-off').click();
    cy.get('div[data-testid=alert-tpmv2-bios]');
    cy.get('input[id=form-radio-diskEncryptionMode-tang-field]').click();
    cy.get('h6').contains('Tang servers'); // TODO: implement specific test scenration ofr encrypted disks
    cy.get('span[id=form-input-enableDiskEncryptionOnMasters-field-on]').click();
    cy.get('div[data-testid=alert-tpmv2-bios]').should('not.exist');

    // TODO: test various field validations

    cy.get('.pf-c-page__main').scrollTo('bottom');
    cy.get('button[name="next"]').contains('Next').should('not.be.disabled');
    cy.get('button[name="cancel"]').contains('Cancel').should('not.be.disabled');

    cy.get('button[name="next"]').click();
    cy.log('Creating a cluster in the Assisted Service');
    cy.get('.pf-c-wizard__nav-link.pf-m-current').contains('Host discovery');
    cy.get('h2').contains('Host discovery');
  });

  // Hints for clean-up:
  //  curl -X DELETE http://192.168.111.80:8090/api/assisted-install/v2/clusters/158b40f9-8608-4d29-b758-2522966fe2b4
  //  + infraEnv and rediscover agents
});
