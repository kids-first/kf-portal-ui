import React from 'react';

import { DashboardCard } from '../styles';
import CardHeader from 'uikit/Card/CardHeader';
import AccessGate from '../../AccessGate';
import DownloadController from 'icons/DownloadController';

const AuthorizedStudies = () => (
  <DashboardCard title="Studies" Header={CardHeader} inactive>
    <AccessGate
      Icon={DownloadController}
      title="Access Controlled Data"
      detail="To access controlled study files, connect to Gen3."
    >
      <button>connect</button>
    </AccessGate>
  </DashboardCard>
);

export default AuthorizedStudies;
