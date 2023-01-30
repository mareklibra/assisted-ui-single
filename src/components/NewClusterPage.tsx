import React from 'react';
import { NewSingleClusterPage } from 'openshift-assisted-ui-lib/ocm';
import { AppPage } from './AppPage';

// TODO(mlibra): Remove OCP version dropdown
// clarify "Hosts not showing up?"
// final restart-modal

export const NewClusterPage: React.FC = () => {
  return (
    <AppPage>
      <NewSingleClusterPage />
    </AppPage>
  );
};
