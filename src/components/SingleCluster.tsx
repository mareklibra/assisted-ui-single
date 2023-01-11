import React from 'react';
import { PageSectionVariants, PageSection } from '@patternfly/react-core';
import { OCM } from 'openshift-assisted-ui-lib';
import { Redirect } from 'react-router-dom';
import { ROUTE_BASE_PATH } from '../config';

const { ErrorState, LoadingState, Services, Api } = OCM;

const SingleCluster = () => {
  const [error, setError] = React.useState<string>();
  const [clusters, setClusters] = React.useState<OCM.Cluster[]>();

  const fetchClusters = React.useCallback(async () => {
    try {
      const { data } = await Services.APIs.ClustersAPI.list();
      setClusters(data);
      setError(undefined);
    } catch (e) {
      Api.handleApiError(e, () => setError('Failed to fetch cluster.'));
    }
  }, [setClusters]);

  React.useEffect(() => {
    void fetchClusters();
  }, [fetchClusters]);

  if (error) {
    return (
      <PageSection variant={PageSectionVariants.light} isFilled>
        <ErrorState title="Failed to fetch cluster." fetchData={fetchClusters} />
      </PageSection>
    );
  }

  if (!clusters) {
    return (
      <PageSection variant={PageSectionVariants.light} isFilled>
        <LoadingState />
      </PageSection>
    );
  }

  if (clusters.length === 0) {
    return <Redirect to={`${ROUTE_BASE_PATH}/new`} />;
  }

  if (clusters.length > 1) {
    // Recent assumption: there should never be more than one cluster, not even a Day2 cluster is possible.
    console.error('More than one cluster found!', clusters);
  }

  return <Redirect to={`${ROUTE_BASE_PATH}/clusters/${clusters[0].id}`} />;
};

export default SingleCluster;
