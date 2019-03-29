import React, { Fragment } from 'react';
import { compose, lifecycle } from 'recompose';
import { Link } from 'react-router-dom';
import { injectState } from 'freactal';
import { withTheme } from 'emotion-theming';
import { Trans } from 'react-i18next';
import { isEmpty } from 'lodash';

import CardHeader from 'uikit/Card/CardHeader';
import DownloadController from 'icons/DownloadController';

import { withApi } from 'services/api';
import StudiesConnected from './StudiesConnected';

import AccessGate from '../../AccessGate';
import { DashboardCard, CardContentSpinner } from '../styles';

import Info from '../Info';

import { CardActionButton } from '../styles';

const AuthorizedStudies = compose(
  withApi,
  injectState,
  withTheme,
  lifecycle({
    async componentDidMount() {
      const {
        effects,
        api,
        state: { fenceConnectionsInitialized },
      } = this.props;
      // Only fetch connections once - don't fetch if we've done it previously
      !fenceConnectionsInitialized && effects.fetchFenceConnections({ api });
    },
  }),
)(
  ({
    state: { loggedInUser, fenceConnectionsInitialized, fenceConnections, fenceAuthStudies },
    effects,
    theme,
    api,
    ...props
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
                <Link to={`/user/${loggedInUser.egoId}#settings`}>
                  <Trans>Settings</Trans>
                </Link>
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
