// Import css before everything to make sure it is applied correctly
import 'style/themes/kids-first/dist/antd.css';
import 'style/themes/kids-first/main.scss';
import './index.css';

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { initUserSnap } from 'services/initUsersnap';

initUserSnap();

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root'),
);
