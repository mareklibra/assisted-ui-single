import { DEFAULT_API_VIP, DEFAULT_INGRESS_VIP } from './constants';

export const getPullSecret = () => {
  const pullSecret = Cypress.env('PULL_SECRET_B64') as string | undefined;
  if (pullSecret) {
    return Buffer.from(pullSecret, 'base64').toString('utf8');
  }

  const pullSecretFile = Cypress.env('PULL_SECRET_FILE') as string;
  if (!pullSecretFile) {
    cy.log('Missing CYPRESS_PULL_SECRET_FILE environment variable');
  }
  console.log('Reading pull secret file: ', pullSecretFile);
  return cy.readFile(pullSecretFile, 'utf8');
};

export const isSkipCreateCluster = () => Cypress.env('SKIP_CREATE_CLUSTER') === 'yes';

export const getIngressVip = () => Cypress.env('INRESS_VIP') || DEFAULT_INGRESS_VIP;
export const getApiVip = () => Cypress.env('API_VIP') || DEFAULT_API_VIP;
