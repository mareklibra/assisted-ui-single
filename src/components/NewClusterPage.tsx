import React from 'react';
import { NewSingleClusterPage } from 'openshift-assisted-ui-lib/ocm';
import { AppPage } from './AppPage';

// TODO(mlibra): Remove OCP version dropdown
// TODO(mlibra): Clarify DHCP vs. Static IPs configuration
// hide operators
// remove Ad host
// remove SNO
// final restart-modal

export const NewClusterPage: React.FC = () => {
  return (
    <AppPage>
      <NewSingleClusterPage />
    </AppPage>
  );
};
