import React from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import { AssistedUILibVersion, Features, Store } from 'openshift-assisted-ui-lib/ocm';

import { ROUTE_BASE_PATH, SINGLE_CLUSTER_ENABLED_FEATURES } from './config';
import { SingleCluster } from './components/SingleCluster';
import { NewClusterPage } from './components/NewClusterPage';
import { ClusterPage } from './components/ClusterPage';

const { FeatureGateContextProvider } = Features;
const { store } = Store;

// import reactLogo from './assets/react.svg';

import './App.css';

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
