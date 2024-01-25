// Import css before everything to make sure it is applied correctly
import 'style/themes/kids-first/dist/antd.css';
import 'style/themes/kids-first/main.scss';
import './index.css';

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { initUserSnap } from 'services/initUsersnap';

initUserSnap();

//On Summary tab ResizableGridLayout fails with new createRoot(container) from React 18
//so we need to keep ReactDOM.render for now until we solve this issue
//eslint-disable-next-line react/no-deprecated
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root'),
);
