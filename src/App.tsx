import * as React from 'react';
import { OCM } from 'openshift-assisted-ui-lib';

// import reactLogo from './assets/react.svg';

import './App.css';

const { Services } = OCM;

function App() {
  const [clusters, setClusters] = React.useState<OCM.Cluster[]>();
  React.useEffect(() => {
    const doItAsync = async () => {
      try {
        const clusters = (await Services.APIs.ClustersAPI.list()).data;
        console.log('Clusters list retrieved: ', clusters);
        setClusters(clusters);
      } catch (e) {
        console.error('Failed to get list of clusters: ', e);
      }
    };
    doItAsync();
  }, []);

  return (
    <div>
      This is the Assisted Installer Web User Interface.
      <br />
      Clusters:
      {clusters ? JSON.stringify(clusters) : 'Loading...'}
    </div>
  );
}

export default App;
