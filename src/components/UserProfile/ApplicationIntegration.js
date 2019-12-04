import React, { Fragment } from 'react';
import { Card, Col, Row, Typography } from 'antd';
import { cavaticaWebRoot } from 'common/injectGlobals';

import cavaticaLogo from 'assets/logo-cavatica.svg';
import CavaticaIntegrationContainer from './CavaticaIntegration';
import './style.css';
import style from './style';

const { Title } = Typography;

const ApplicationIntegration = () => {
  return (
    <Card
      title={
        <Title level={3} strong>
          Application Integrations
        </Title>
      }
      className={'card'}
      headStyle={style.cardHeadStyle}
      bodyStyle={style.cardBodyStyle}
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
                <a target="_blank" rel="noopener noreferrer" href={cavaticaWebRoot}>
                  Cavatica
                </a>
                .
              </Fragment>
            }
          />
        </Col>
      </Row>
    </Card>
  );
};

export default ApplicationIntegration;
