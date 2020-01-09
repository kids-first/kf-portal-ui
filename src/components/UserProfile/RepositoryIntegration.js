import React from 'react';
import { Card, Divider, Row, Typography } from 'antd';
import { dcfWebRoot, gen3WebRoot } from 'common/injectGlobals';
import Integration from './Integration';
import kfFrameworkServicesLogo from 'assets/kids-first-framework-services.svg';
import dcfLogo from 'assets/logo-dcf.svg';
import { DCF, GEN3 } from 'common/constants';
import './style.css';
import { makeCommonCardPropsReadOnly } from 'components/UserProfile/utils';

const { Paragraph } = Typography;

const RepositoryIntegration = () => {
  return (
    <Card
      {...{
        ...makeCommonCardPropsReadOnly({
          title: ' Data Repository Integrations',
          canEdit: false,
          isProfileUpdating: false,
        }),
      }}
    >
      <Row type={'flex'}>
        <Paragraph>
          The Kids First DRC provides the ability to integrate across different data repositories
          for pediatric research. By connecting to each integration (powered by{' '}
          <a target="_blank" rel="noopener noreferrer" href={gen3WebRoot}>
            Gen3
          </a>
          ), you will immediately have the ability to analyze the data available from these
          repositories in Cavatica through this portal. Please remember that it is your
          responsibility to follow any data use limitations with controlled access data.
        </Paragraph>
        <Divider className={'ri-divider'} />
      </Row>
      <div>
        <Integration
          fence={GEN3}
          logo={
            <a href={gen3WebRoot} target="_blank" rel="noopener noreferrer">
              <img
                src={kfFrameworkServicesLogo}
                alt="Kids First Framework Services logo"
                height="40px"
              />
            </a>
          }
          description={`Access all released Kids First controlled access data by connecting your account using your NIH login credentials.`}
        />
        <Divider />
        <Integration
          fence={DCF}
          logo={
            <a href={dcfWebRoot} target="_blank" rel="noopener noreferrer">
              <img src={dcfLogo} alt="Data Commons Framework Logo" height="40px" />
            </a>
          }
          description={`Access select NCI controlled access data by connecting your account using your NIH login credentials.`}
        />
      </div>
    </Card>
  );
};

export default RepositoryIntegration;
