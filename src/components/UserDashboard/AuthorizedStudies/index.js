import React, { Fragment } from 'react';
import { compose } from 'recompose';
import { Link } from 'react-router-dom';
import { injectState } from 'freactal';
import { isEmpty } from 'lodash';

import CardHeader from 'uikit/Card/CardHeader';
import DownloadController from 'icons/DownloadController';

import StudiesConnected from './StudiesConnected';
import { fenceConnectionInitializeHoc } from 'stateProviders/provideFenceConnections';

import AccessGate from '../../AccessGate';
import { DashboardCard, CardContentSpinner } from '../styles';

import Info from '../Info';

import { CardActionButton } from '../styles';

const AuthorizedStudies = compose(
  injectState,
  fenceConnectionInitializeHoc,
)(
  ({
    state: { loggedInUser, fenceConnectionsInitialized, fenceConnections, fenceAuthStudies },
  }) => {
    const Header = (
      <CardHeader title="Authorized Studies" badge={fenceAuthStudies.length || null} />
    );

    const inactive = !fenceConnectionsInitialized;
    return (
      <DashboardCard Header={Header} inactive={inactive} scrollable={!isEmpty(fenceConnections)}>
        {inactive ? (
          <CardContentSpinner />
        ) : isEmpty(fenceConnections) ? (
          <Fragment>
            <AccessGate
              mt={'40px'}
              Icon={DownloadController}
              title="Access Controlled Data"
              detail={
                <span>
                  To access controlled study files,{' '}
                  <strong>connect to our data repository partners.</strong>
                </span>
              }
            >
              <CardActionButton>
                <Link to={`/user/${loggedInUser.egoId}#settings`}>Settings</Link>
              </CardActionButton>
            </AccessGate>
            <Info
              link={{
                url:
                  'https://kidsfirstdrc.org/support/studies-and-access/#applying-for-data-access',
                text: 'applying for data access.',
              }}
            />
          </Fragment>
        ) : (
          <StudiesConnected />
        )}
      </DashboardCard>
    );
  },
);

export default AuthorizedStudies;
