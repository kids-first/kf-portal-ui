import React, { Fragment } from 'react';
import { compose } from 'recompose';
import { injectState } from 'freactal';
import isEmpty from 'lodash/isEmpty';
import DownloadController from 'icons/DownloadController';
import StudiesConnected from './StudiesConnected';
import { fenceConnectionInitializeHoc } from 'stateProviders/provideFenceConnections';
import AccessGate from '../../AccessGate';
import Info from '../Info';
import { Button, Card, Typography } from 'antd';

const { Title } = Typography;

const AuthorizedStudies = compose(
  injectState,
  fenceConnectionInitializeHoc,
)(
  ({
    state: { loggedInUser, fenceConnectionsInitialized, fenceConnections, fenceAuthStudies },
  }) => {
    const inactive = !fenceConnectionsInitialized;
    return (
      <Card
        title={
          <Title level={3}>{`Authorized Studies ${
            fenceAuthStudies.length ? '(' + fenceAuthStudies.length + ')' : ''
          }`}</Title>
        }
        loading={inactive}
      >
        {isEmpty(fenceConnections) ? (
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
              <Button type={'primary'} shape={'round'} href={`/user/${loggedInUser._id}#settings`}>
                SETTINGS
              </Button>
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
      </Card>
    );
  },
);

export default AuthorizedStudies;
