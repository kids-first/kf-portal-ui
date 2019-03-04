import React, { Fragment } from 'react';
import { compose, lifecycle } from 'recompose';
import { Link } from 'react-router-dom';
import { injectState } from 'freactal';
import { withTheme } from 'emotion-theming';
import { Trans } from 'react-i18next';
import Component from 'react-component-component';
import { isEmpty } from 'lodash';

import CardHeader from 'uikit/Card/CardHeader';
import DownloadController from 'icons/DownloadController';

import { provideFenceConnections } from 'stateProviders';
import { withApi } from 'services/api';
import StudiesConnected from './StudiesConnected';

import AccessGate from '../../AccessGate';
import { DashboardCard, CardContentSpinner } from '../styles';

import Info from '../Info';

import { CardActionButton } from '../styles';

const AuthorizedStudies = compose(
  withApi,
  provideFenceConnections,
  injectState,
  withTheme,
  lifecycle({
    componentDidMount() {
      const { api } = this.props;
      this.props.effects.fetchFenceConnections({ api });
    },
  }),
)(
  ({
    state: { loggedInUser, fetchingFenceConnections, fetchingFenceStudies, fenceConnections },
    effects,
    theme,
    api,
    ...props
  }) => (
    <Component initialState={{ connected: false, badgeNumber: null }}>
      {({ setState, state }) => {
        const Header = <CardHeader title="Authorized Studies" badge={state.badgeNumber} />;

        return (
          <DashboardCard
            Header={Header}
            inactive={fetchingFenceConnections || fetchingFenceStudies}
            scrollable={!isEmpty(fenceConnections)}
          >
            {fetchingFenceConnections ? (
              <CardContentSpinner />
            ) : !isEmpty(fenceConnections) ? (
              <StudiesConnected
                setBadge={n =>
                  n && n !== state.badgeNumber
                    ? setState({
                        badgeNumber: n,
                      })
                    : null
                }
              />
            ) : (
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
            )}
          </DashboardCard>
        );
      }}
    </Component>
  ),
);

export default AuthorizedStudies;
