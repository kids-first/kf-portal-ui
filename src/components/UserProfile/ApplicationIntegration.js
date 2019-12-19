import React, { Fragment } from 'react';
import { Card, Row } from 'antd';
import { cavaticaWebRoot } from 'common/injectGlobals';
import cavaticaLogo from 'assets/logo-cavatica.svg';
import CavaticaIntegrationContainer from './CavaticaIntegration';
import './style.css';
import { makeCommonCardPropsReadOnly } from 'components/UserProfile/utils';

const ApplicationIntegration = () => {
  return (
    <Card
      {...{
        ...makeCommonCardPropsReadOnly({
          title: 'Application Integrations',
          canEdit: false,
          isProfileUpdating: false,
        }),
      }}
    >
      <Row>
        <CavaticaIntegrationContainer
          logo={<img src={cavaticaLogo} alt="Cavatica Logo" height="45px" />}
          description={
            <Fragment>
              {
                'Analyze data quickly by connecting your account to the cloud compute environment,  '
              }
              <a target="_blank" rel="noopener noreferrer" href={cavaticaWebRoot}>
                Cavatica
              </a>
              .
            </Fragment>
          }
        />
      </Row>
    </Card>
  );
};

export default ApplicationIntegration;
