import * as React from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import { OCM } from 'openshift-assisted-ui-lib';

import { ROUTE_BASE_PATH, SINGLE_CLUSTER_ENABLED_FEATURES } from './config';
import SingleCluster from './components/SingleCluster';

// import reactLogo from './assets/react.svg';

import './App.css';

const {
  AssistedUILibVersion,
  ClusterPage,
  NewClusterPage,
  Features: { FeatureGateContextProvider },
  Store: { store },
} = OCM;

function App() {
  return (
    <Provider store={store}>
      <FeatureGateContextProvider features={SINGLE_CLUSTER_ENABLED_FEATURES}>
        <AssistedUILibVersion />
        <BrowserRouter>
          <Switch>
            <Route path={`${ROUTE_BASE_PATH}/clusters/:clusterId`} component={ClusterPage} />
            <Route path={`${ROUTE_BASE_PATH}/new`} component={NewClusterPage} />
            <Route path={`${ROUTE_BASE_PATH}/clusters`} component={SingleCluster} />
            <Redirect to={`${ROUTE_BASE_PATH}/clusters`} />
          </Switch>
        </BrowserRouter>
      </FeatureGateContextProvider>
    </Provider>
  );
}

export default App;
