import React from 'react';
import { Badge, Button, Card } from 'antd';
import isEmpty from 'lodash/isEmpty';

import AccessGate from 'components/AccessGate';
import useFenceConnections from 'hooks/useFenceConnections';
import useFenceStudies from 'hooks/useFenceStudies';
import useUser from 'hooks/useUser';
import DownloadController from 'icons/DownloadController';
import { AllFencesNames } from 'store/fenceTypes';

import Info from '../Info';

import StudiesConnected from './StudiesConnected';

import { antCardHeader } from '../../CohortBuilder/Summary/Cards/StudiesChart.module.css';

const AuthorizedStudies = ({ api }) => {
  const { user } = useUser();
  const { loadingFences, fenceConnections } = useFenceConnections(api, AllFencesNames);
  const { loadingStudiesForFences, fenceAuthStudies } = useFenceStudies(api);

  const isLoadingDataFromFencesOrStudies =
    loadingFences.length > 0 || loadingStudiesForFences.length > 0;
  const hasNoFenceConnections = isEmpty(fenceConnections);

  return (
    <Card
      title={
        <div className={antCardHeader}>
          <span className={'title-dashboard-card'}>Authorized Studies&nbsp;</span>

          <Badge count={fenceAuthStudies.length || 0} showZero={!hasNoFenceConnections} />
        </div>
      }
      loading={isLoadingDataFromFencesOrStudies}
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
            <Button type={'primary'} shape={'round'} href={`/user/${user._id}#settings`}>
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
        <StudiesConnected user={user} fenceAuthStudies={fenceAuthStudies} />
      )}
    </Card>
  );
};

export default AuthorizedStudies;
