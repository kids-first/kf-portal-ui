/* eslint-disable simple-import-sort/imports */
// Import css before everything to make sure it is applied correctly

import '@ferlab/ui/themes/default/theme.template.css';

import 'style/themes/kids-first/dist/antd.css';
import 'style/themes/kids-first/dist/colors.css';
import 'style/themes/kids-first/main.css';
import './index.css';

import { initUserSnap } from 'services/initUsersnap';

import App from './App';

initUserSnap();

import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import * as Sentry from '@sentry/browser';
import { localStorageIntegration } from '@ferlab/ui/core/utils/sentry/localStorageIntegration';
import EnvironmentVariables from 'helpers/EnvVariables';

const reactAppWebRoot = EnvironmentVariables.configFor('REACT_APP_WEB_ROOT');
const SentryDSN = EnvironmentVariables.configFor('SENTRY_API');

Sentry.init({
  dsn: SentryDSN,
  integrations: [
    Sentry.browserTracingIntegration({
      // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
      tracePropagationTargets: ['localhost', reactAppWebRoot],
    }),
    Sentry.contextLinesIntegration(),
    Sentry.browserProfilingIntegration(),
    localStorageIntegration('LocalStorage'),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0, // Capture 100% of the transactions
});

const container = document.getElementById('root');
const root = createRoot(container); // createRoot(container!) if you use TypeScript

root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
);
