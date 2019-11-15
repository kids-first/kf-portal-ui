import React, { Fragment } from 'react';
import { Layout, Card, Typography, Row, Col, Divider } from 'antd';
import ExternalLink from 'uikit/ExternalLink';
import { gen3WebRoot, dcfWebRoot, cavaticaWebRoot } from 'common/injectGlobals';
import IntegrationContainer from './IntegrationContainer';
import kfFrameworkServicesLogo from 'assets/kids-first-framework-services.svg';
import dcfLogo from 'assets/logo-dcf.svg';
import { DCF, GEN3 } from 'common/constants';
import cavaticaLogo from 'assets/logo-cavatica.svg';
import CavaticaIntegrationContainer from './CavaticaIntegrationContainer'
const { Content } = Layout;
const { Title, Paragraph } = Typography;

const Settings = () => {
  return (
    <Layout
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '25px',
        background: '#fff',
        height: '100%',
      }}
    >
      <Content>
        <Row style={{ paddingBottom: '48px' }}>
          <Card
            title={
              <Title
                level={3}
                style={{
                  color: 'rgb(43, 56, 143)',
                }}
              >
                Data Repository Integrations
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
              <Col span={24}>
                <Paragraph>
                  The Kids First DRC provides the ability to integrate across different data
                  repositories for pediatric research. By connecting to each integration (powered by{' '}
                  <ExternalLink href={gen3WebRoot}>Gen3</ExternalLink>), you will immediately have
                  the ability to analyze the data available from these repositories in Cavatica
                  through this portal. Please remember that it is your responsibility to follow any
                  data use limitations with controlled access data.
                </Paragraph>
                <Divider style={{ marginBottom: '24px' }} />
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <IntegrationContainer
                  fence={GEN3}
                  logo={
                    <a href={gen3WebRoot} target="_blank">
                      <img
                        src={kfFrameworkServicesLogo}
                        alt="Kids First Framework Services logo"
                        height="45px"
                      />
                    </a>
                  }
                  description={`Access all released Kids First controlled access data by connecting your account using your NIH login credentials.`}
                />
              </Col>
              <Col span={12}>
                <IntegrationContainer
                  fence={DCF}
                  logo={
                    <a href={dcfWebRoot} target="_blank">
                      <img src={dcfLogo} alt="Data Commons Framework Logo" height="45px" />
                    </a>
                  }
                  description={`   Access select NCI controlled access data by connecting your account using your NIH login credentials.`}
                />
              </Col>
            </Row>
          </Card>
        </Row>
        <Row>
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
        </Row>
      </Content>
    </Layout>
  );
};

export default Settings;
