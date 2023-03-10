import React from 'react';
import { SingleClusterPage } from 'openshift-assisted-ui-lib/ocm';
import { RouteComponentProps } from 'react-router-dom';
import { AppPage } from './AppPage';

type MatchParams = {
  clusterId: string;
};

export const ClusterPage: React.FC<RouteComponentProps<MatchParams>> = ({ match }) => {
  return (
    <AppPage>
      <SingleClusterPage clusterId={match.params?.clusterId} />
    </AppPage>
  );
};
