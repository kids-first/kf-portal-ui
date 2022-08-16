// Import css before everything to make sure it is applied correctly
import 'style/themes/kids-first/dist/antd.css';
import 'style/themes/kids-first/main.scss';
import './index.css';

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { initUserSnap } from 'services/initUsersnap';

initUserSnap();

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
