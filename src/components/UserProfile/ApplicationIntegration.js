import React, { Fragment } from 'react';
import { Card, Col, Row, Typography } from 'antd';
import ExternalLink from 'uikit/ExternalLink';
import { cavaticaWebRoot } from 'common/injectGlobals';

import cavaticaLogo from 'assets/logo-cavatica.svg';
import CavaticaIntegrationContainer from './CavaticaIntegration';

const { Title } = Typography;

const ApplicationIntegration = () => {
  return (
    <Card
      title={
        <Title
          level={3}
          style={{
            color: 'rgb(43, 56, 143)',
          }}
        >
          Application Integrations
        </Title>
      }
      style={{
        width: '1200px',
        borderRadius: '10px',
      }}
      headStyle={{
        color: 'rgb(43, 56, 143)',
        backgroundColor: 'rgb(237,238,241)',
        paddingBottom: '14px',
        paddingTop: '14px',
        paddingLeft: '32px',
        paddingRight: '32px',
      }}
      bodyStyle={{
        padding: '32px',
      }}
    >
      <Row>
        <Col span={12}>
          <CavaticaIntegrationContainer
            logo={<img src={cavaticaLogo} alt="Cavatica Logo" height="45px" />}
            description={
              <Fragment>
                {
                  'Analyze data quickly by connecting your account to the cloud compute environment,  '
                }
                <ExternalLink href={cavaticaWebRoot}>Cavatica</ExternalLink>.
              </Fragment>
            }
          />
        </Col>
      </Row>
    </Card>
  );
};

export default ApplicationIntegration;
