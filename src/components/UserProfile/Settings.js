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
          <ConnectionProvider userEmail={userEmail} />
        </Row>
        <Row style={{ paddingBottom: '48px' }}>
          <RepositoryIntegration />
        </Row>
        <Row style={{ paddingBottom: '48px' }}>
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

