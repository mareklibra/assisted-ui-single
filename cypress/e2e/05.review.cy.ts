/// <reference types="cypress" />

import { CLUSTER_DOMAIN, CLUSTER_NAME } from '../support/constants';
import { getApiVip, getIngressVip } from '../support/utils';

describe('Networking Page', () => {
  before(() => {
    // Important
    cy.log('Prior runing these tests, make sure:');
    cy.log(
      "  - the 'creates cluster' test case from 01.homepage.cy.ts passed and so we have a cluster to build upon.",
    );
    cy.log(
      "  - the 'can collect networking setting' test case from 04.networking.cy.ts passed and so the cluster is ready to intall",
    );
  });

  it('renders Review and create step', () => {
    cy.visit('/');
    cy.log(
      'The wizard flow is expected to start on the Review and create since: All validations are passing (see Networking step)',
    );
    cy.get('.pf-c-wizard__nav-link.pf-m-current').contains('Review and create');
    cy.get('h2').contains('Review and create');

    cy.log('Preflit checks expandable section');
    cy.get('div[data-testid=review-preflight-checks-main]').click();
    cy.get('dd[data-testid=cluster-preflight-checks-value]').contains('All validations passed');

    cy.log('Cluster details');
    cy.get('td[data-testid=cluster-address]').contains(`${CLUSTER_NAME}.${CLUSTER_DOMAIN}`);
    cy.get('td[data-testid=openshift-version]'); // Hard to test for content here
    cy.get('td[data-testid=cpu-architecture]').contains('x86_64');
    cy.get('td[data-testid=network-configuration]').contains('DHCP');

    cy.log('Host inventory section');
    cy.get('table[data-testid=review-host-inventory-table]');

    cy.log('Networking section');
    cy.get('td[data-testid=networking-management-type]').contains('Cluster-managed networking');
    cy.get('td[data-testid=stack-type]').contains('IPv4');
    // skip CIDR
    cy.get('td[data-testid=api-vip]').contains(getApiVip());
    cy.get('td[data-testid=ingress-vip]').contains(getIngressVip());
    // skip Cluster network CIDR
    cy.get('td[data-testid=networking-type]').contains('Open Virtual Network (OVN)');

    cy.log('Action buttons');
    cy.get('button[name="back"]').contains('Back').should('not.be.disabled');
    cy.get('button[name="cancel"]').contains('Cancel').should('not.be.disabled');
    cy.get('#cluster-events-button').contains('View Cluster Events');
    cy.get('button[data-testid=button-install-cluster]').should('not.be.disabled');

    cy.log('Trigerring the installation');
    cy.log(
      'SKIPPED - untill we have full flow covered (blocked on https://issues.redhat.com/browse/AGENT-522',
    );
    // cy.get('button[data-testid=button-install-cluster]').click();
    // cy.get('h2').contains('Installation progress');
  });
});
