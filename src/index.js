/* eslint-disable simple-import-sort/imports */
// Import css before everything to make sure it is applied correctly

import 'style/themes/kids-first/dist/antd.css';
import 'style/themes/kids-first/main.scss';
import './index.css';

import { initUserSnap } from 'services/initUsersnap';

import App from './App';

initUserSnap();

import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
const container = document.getElementById('root');
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
);
