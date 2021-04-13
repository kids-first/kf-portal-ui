import React, { Fragment } from 'react';
import { compose } from 'recompose';
import { injectState } from 'freactal';
import isEmpty from 'lodash/isEmpty';
import DownloadController from 'icons/DownloadController';
import StudiesConnected from './StudiesConnected';
import { fenceConnectionInitializeHoc } from 'stateProviders/provideFenceConnections';
import AccessGate from '../../AccessGate';
import Info from '../Info';
import { Badge, Button } from 'antd';
import Card from '@ferlab/ui/core/view/GridCard';
import { antCardHeader } from '../../CohortBuilder/Summary/Cards/StudiesChart.module.css';

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
          <div className={antCardHeader}>
            <span className={'title-dashboard-card'}>Authorized Studies&nbsp;</span>

            <Badge count={fenceAuthStudies.length || 0} showZero={!isEmpty(fenceConnections)} />
          </div>
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
