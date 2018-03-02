import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { getAppElement } from './services/globalDomNodes.js';

ReactDOM.render(<App />, getAppElement());
registerServiceWorker();
