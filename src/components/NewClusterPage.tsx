import React from 'react';
import { NewClusterPage as NewClusterPageLib } from 'openshift-assisted-ui-lib/ocm';
import { AppPage } from './AppPage';

// TODO(mlibra): Remove OCP version dropdown
// TODO(mlibra): Clarify DHCP vs. Static IPs configuration
// TODO(mlibra): load locales

export const NewClusterPage: React.FC = () => {
  return (
    <AppPage>
      <NewClusterPageLib />
    </AppPage>
  );
};
