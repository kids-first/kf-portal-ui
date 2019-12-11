import React from 'react';
import { Layout, Row } from 'antd';
import PropTypes from 'prop-types';
import RepositoryIntegration from './RepositoryIntegration';
import ApplicationIntegration from './ApplicationIntegration';
import ConnectionProvider from './ConnectionProvider';
import DeleteAccount from 'components/UserProfile/DeleteAccount';

const { Content } = Layout;

const Settings = props => {
  const { userEmail } = props;
  return (
    <Layout className={'settings-layout'}>
      <Content>
        <Row className={'settings-row-but-last'}>
          <ConnectionProvider userEmail={userEmail} />
        </Row>
        <Row className={'settings-row-but-last'}>
          <RepositoryIntegration />
        </Row>
        <Row className={'settings-row-but-last'}>
          <ApplicationIntegration />
        </Row>
        {localStorage.getItem('SHOW_DELETE_ACCOUNT') && (
          <Row>
            <DeleteAccount />
          </Row>
        )}
      </Content>
    </Layout>
  );
};

Settings.propTypes = {
  userEmail: PropTypes.string.isRequired,
};

export default Settings;
