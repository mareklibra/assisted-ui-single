/// <reference types="cypress" />

describe('Homepage', () => {
  xit('can be loaded', () => {
    cy.visit('/');

    cy.get('h2').contains('Cluster details');
    cy.get('.pf-c-page__main').scrollTo('bottom');
    cy.get('button[name="next"]').contains('Next').should('be.disabled');
  });

  it('contains expected components', () => {
    cy.visit('/');
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
    cy.get('div[id=form-input-baseDnsDomain-field-helper] > strong').contains(
      '[Cluster Name].[example.com]',
    );

    cy.get('label[for=form-input-openshiftVersion-field]').contains('OpenShift version');
    cy.get('div[id=form-input-openshiftVersion-field] > button');
    cy.get(
      'div[id=form-input-openshiftVersion-field] > button > .pf-c-dropdown__toggle-text',
    ).contains('OpenShift'); // testing for part of the OCP image name

    // scroll to move visible area
    cy.get('.pf-c-page__main').scrollTo('bottom');

    cy.get('label[for=form-input-pullSecret-field]').contains('Pull secret');
    cy.get('label[for=form-input-pullSecret-field] > .pf-c-form__label-required');
    cy.get('textarea[id=form-input-pullSecret-field');

    cy.get('label[for=form-input-enableDiskEncryptionOnMasters-field]').contains(
      'Control plane nodes',
    );
    cy.get('span[id=form-input-enableDiskEncryptionOnMasters-field-on]');
    cy.get('span[id=form-input-enableDiskEncryptionOnWorkers-field-on]');

    // Encryption warning
    cy.get('div[id=alert-tpmv2-bios]').should('not.exist');
    /* In a later test:
    cy.get('span[id=form-input-enableDiskEncryptionOnMasters-field-on]').click()
    cy.get('div[id=alert-tpmv2-bios]');
    ...
    */
    // Bottom
    cy.get('button[name="next"]').contains('Next').should('be.disabled');
    cy.get('button[name="cancel"]').contains('Cancel').should('not.be.disabled');
  });
});
