/// <reference types="cypress" />

import { VIP_ALLOCATION_TIMEOUT } from '../support/constants';
import { getApiVip, getIngressVip } from '../support/utils';

/*
  Prior runing these tests, make sure the 'creates cluster' test case from 01.homepage.cy.ts passed and created the cluster we will build upon.
*/

describe('Networking Page', () => {
  xit('renders Networking step and can basically navigate', () => {
    cy.visit('/');
    // There is automatic transition to the Review step once all validations are passing
    cy.get('#wizard-nv-host-discovery').click();
    cy.get('.pf-c-wizard__nav-link.pf-m-current').contains('Host discovery');
    cy.get('h2').contains('Host discovery');
    cy.url().should('not.contain', '/new'); // We must be in the Edit flow now.

    cy.log('Navigation buttons on Host discovery page should not be disabled');
    cy.get('.pf-c-page__main').scrollTo('bottom');
    cy.get('button[name="next"]').contains('Next').should('not.be.disabled');
    cy.get('button[name="back"]').contains('Back').should('not.be.disabled');
    cy.get('button[name="cancel"]').contains('Cancel').should('not.be.disabled');

    cy.log('Next to Storage');
    cy.get('.pf-c-page__main').scrollTo('bottom');
    cy.get('button[name="next"]').click();
    cy.get('.pf-c-wizard__nav-link.pf-m-current').contains('Storage');
    cy.get('h2').contains('Storage');

    cy.log('Next to Networking');
    cy.get('.pf-c-page__main').scrollTo('bottom');
    cy.get('button[name="next"]').click();
    cy.get('.pf-c-wizard__nav-link.pf-m-current').contains('Networking');
    cy.get('h2').contains('Networking');

    cy.log('Next button should be disabled since input is needed');
    cy.get('.pf-c-page__main').scrollTo('bottom');
    cy.get('button[name="next"]').contains('Next').should('be.disabled');
    cy.get('button[name="back"]').contains('Back').should('not.be.disabled');
    cy.get('button[name="cancel"]').contains('Cancel').should('not.be.disabled');
    cy.get('#cluster-events-button').contains('View Cluster Events');

    cy.log('Go Back to Storage');
    cy.get('button[name="back"]').click();
    cy.get('.pf-c-wizard__nav-link.pf-m-current').contains('Storage');
    cy.get('h2').contains('Storage');

    cy.log('Next to Networking');
    cy.get('.pf-c-page__main').scrollTo('bottom');
    cy.get('button[name="next"]').click();
    cy.get('.pf-c-wizard__nav-link.pf-m-current').contains('Networking');
    cy.get('h2').contains('Networking');
  });

  it('contains expected components', () => {
    cy.visit('/');
    cy.get('#wizard-nv-host-discovery').click();
    cy.get('.pf-c-wizard__nav-link.pf-m-current').contains('Host discovery');
    cy.get('h2').contains('Host discovery');
    cy.url().should('not.contain', '/new'); // We must be in the Edit flow now.

    cy.log('Navigation buttons on Host discovery page should not be disabled');
    cy.get('.pf-c-page__main').scrollTo('bottom');
    cy.get('button[name="next"]').contains('Next').should('not.be.disabled');
    cy.get('button[name="back"]').contains('Back').should('not.be.disabled');
    cy.get('button[name="cancel"]').contains('Cancel').should('not.be.disabled');

    cy.log('Next to Storage');
    cy.get('.pf-c-page__main').scrollTo('bottom');
    cy.get('button[name="next"]').click();
    cy.get('.pf-c-wizard__nav-link.pf-m-current').contains('Storage');
    cy.get('h2').contains('Storage');

    cy.log('Next to Networking');
    cy.get('.pf-c-page__main').scrollTo('bottom');
    cy.get('button[name="next"]').click();
    cy.get('.pf-c-wizard__nav-link.pf-m-current').contains('Networking');
    cy.get('h2').contains('Networking');

    cy.log('Network management section');
    cy.get('#form-radio-managedNetworkingType-clusterManaged-field').should('be.checked');
    cy.get('#form-radio-managedNetworkingType-userManaged-field').click();
    cy.get('.pf-c-wizard__main-body').contains('Please refer to the');
    cy.get('#form-radio-managedNetworkingType-clusterManaged-field').click();

    cy.log('Networking stack type');
    cy.get('label[for=form-radio-stackType-field]').contains('Networking stack type');
    cy.get('#form-radio-stackType-singleStack-field').should('be.checked').should('be.disabled');

    cy.get('label[for=networkType]').contains('Network type');
    // Commented since it may varry among multiple test executions.
    // cy.get('#form-radio-networkType-OVNKubernetes-field').should('be.checked').should('be.enabled');
    cy.get('#form-radio-networkType-OpenShiftSDN-field')
      // .should('not.be.checked')
      .should('be.enabled');

    cy.get('select[id=form-input-machineNetworks-0-cidr-field]');
    cy.get(
      'select[id=form-input-machineNetworks-0-cidr-field] > #form-input-hostSubnet-field-option-no-subnet-selected',
    )
      .should('be.disabled')
      .contains('Please select a subnet. (1 available)');
    cy.get(
      'select[id=form-input-machineNetworks-0-cidr-field] > option[id=form-input-hostSubnet-field-option-0]',
    );

    cy.get('#form-checkbox-vipDhcpAllocation-field').should('not.be.checked');
    cy.get('label[for=form-checkbox-vipDhcpAllocation-field]').contains(
      'Allocate IPs via DHCP server',
    );
    cy.get('#vip-api-allocated').should('not.exist');
    cy.get('#form-radio-networkType-OpenShiftSDN-field').click();
    cy.get('#form-checkbox-vipDhcpAllocation-field')
      .should('not.be.checked')
      .should('not.be.disabled')
      .click();

    cy.log('Switched to SDN, waiting for VIPs to be allocated');
    cy.get('#vip-api-allocated', { timeout: VIP_ALLOCATION_TIMEOUT }); // static text contains IP
    cy.get('#vip-ingress-allocated', { timeout: VIP_ALLOCATION_TIMEOUT }); // contains IP

    cy.log('Switching to OVN (default option), setting vips manually');
    cy.get('#form-radio-networkType-OVNKubernetes-field').should('not.be.checked').click(); // Use OVN farther
    cy.get('input[id=form-input-apiVip-field]').type(getApiVip());
    cy.get('input[id=form-input-ingressVip-field]').type(getIngressVip());
    cy.get('#form-input-sshPublicKey-field').click(); // loosing focus from the VIP input is important for auto-save

    // TODO: Extend following to variable amount of hosts.
    cy.get('#hosts-count').contains(/\([0-9]+\)/); // a number in parentheses (n)
    cy.get('tr[data-testid=host-row-0] > td[data-testid=host-name]').contains('master-0');
    cy.get('tr[data-testid=host-row-0] > td[data-testid=nic-status]').contains('Ready', {
      timeout: VIP_ALLOCATION_TIMEOUT,
    });
    cy.get('tr[data-testid=host-row-0] > td[data-testid=nic-name]').contains('enp2s0'); // fragile but the dev-scripts recently produce that
    cy.get('tr[data-testid=host-row-0] > td[data-testid=nic-ipv4]').contains(
      /([0-9]{1,3}\.){3}[0-9]{1,3}\/([2-9]|[12][0-9]|3[12])/,
    ); // IPv4 CIDR
    cy.get('tr[data-testid=host-row-2] > td[data-testid=nic-status]').contains('Ready', {
      timeout: VIP_ALLOCATION_TIMEOUT,
    });
    cy.get('tr[data-testid=host-row-4] > td[data-testid=nic-status]').contains('Ready', {
      timeout: VIP_ALLOCATION_TIMEOUT,
    });

    cy.log('Going Next to Review and create');
    cy.get('button[name="next"]')
      .contains('Next')
      .should('be.enabled', { timeout: VIP_ALLOCATION_TIMEOUT })
      .click();
    cy.get('.pf-c-wizard__nav-link.pf-m-current').contains('Review and create');
    cy.get('h2').contains('Review and create');
    cy.url().should('not.contain', '/new'); // We must be in the Edit flow now.
  });
});
