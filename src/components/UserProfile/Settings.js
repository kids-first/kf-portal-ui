import React, { useEffect } from 'react';
import { Layout, Row } from 'antd';
import PropTypes from 'prop-types';
import RepositoryIntegration from './RepositoryIntegration';
import ApplicationIntegration from './ApplicationIntegration';
import ConnectionProvider from './ConnectionProvider';
import DeleteAccount from 'components/UserProfile/DeleteAccount';

import { connect } from 'react-redux';
import { clearClusterError } from 'store/actionCreators/workBench';

const mapDispatch = (dispatch) => ({
  onClearClusterError: () => dispatch(clearClusterError()),
});

const { Content } = Layout;

const connector = connect(null, mapDispatch);

const Settings = (props) => {
  const { userEmail, onClearClusterError } = props;

  useEffect(() => {
    onClearClusterError();
  }, [onClearClusterError]);

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

export default connector(Settings);
