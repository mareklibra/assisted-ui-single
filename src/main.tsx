import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { axiosConfig } from './axios';

import './i18n';
import './index.css';

axiosConfig();
ReactDOM.render(<App />, document.getElementById('root'));
