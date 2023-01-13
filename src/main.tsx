import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import './i18n';
import './index.css';

const axiosConfig = () => {
  // Hack for assisted-ui-lib axiosClient.ts, we switched from react-create-app to vite
  // TODO: make it gerenric there by depending on passed parameters from the calling context
  // @ts-ignore
  window.process = {
    env: {
      REACT_APP_API_ROOT: import.meta.env.VITE_ASSISTED_SERVICE_API_ROOT || '/api/assisted-install',
    },
  };
};

axiosConfig();
ReactDOM.render(<App />, document.getElementById('root'));
