import React from 'react';
import Card from '@ferlab/ui/core/view/GridCard';
import { Badge, Button } from 'antd';
import { injectState } from 'freactal';
import isEmpty from 'lodash/isEmpty';
import { compose } from 'recompose';

import { FENCES } from 'common/constants';
import useFenceConnections from 'hooks/useFenceConnections';
import useFenceStudies from 'hooks/useFenceStudies';
import DownloadController from 'icons/DownloadController';

import AccessGate from '../../AccessGate';
import Info from '../Info';

import StudiesConnected from './StudiesConnected';

import { antCardHeader } from '../../CohortBuilder/Summary/Cards/StudiesChart.module.css';

const AuthorizedStudies = compose(injectState)(({ loggedInUser, api }) => {
  const { isFetchingAllFenceConnections, fenceConnections } = useFenceConnections(api, FENCES);
  const { isFetchingAllFenceStudies, fenceAuthStudies } = useFenceStudies(api);

  const isLoadingData = isFetchingAllFenceConnections || isFetchingAllFenceStudies;
  const hasNoFenceConnections = isEmpty(fenceConnections);

  return (
    <Card
      title={
        <div className={antCardHeader}>
          <span className={'title-dashboard-card'}>Authorized Studies&nbsp;</span>

          <Badge count={fenceAuthStudies.length || 0} showZero={!hasNoFenceConnections} />
        </div>
      }
      loading={isLoadingData}
    >
      {hasNoFenceConnections ? (
        <>
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
              url: 'https://kidsfirstdrc.org/support/studies-and-access/#applying-for-data-access',
              text: 'applying for data access.',
            }}
          />
        </>
      ) : (
        <StudiesConnected loggedInUser={loggedInUser} fenceAuthStudies={fenceAuthStudies} />
      )}
    </Card>
  );
});

export default AuthorizedStudies;
