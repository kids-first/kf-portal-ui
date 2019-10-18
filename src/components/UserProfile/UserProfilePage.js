import React from 'react';
import PropTypes from 'prop-types';
import { Layout } from 'antd';

const { Header, Footer, Content } = Layout;

const UserProfilePage = ({ profile, onSummitUpdateProfile, canEdit }) => {
  return (
    <Layout>
      <Header>Header</Header>
      <Content>Content</Content>
      <Footer>Footer</Footer>
    </Layout>
  );
};

UserProfilePage.propTypes = {
  profile: PropTypes.object.isRequired,
  onSummitUpdateProfile: PropTypes.func.isRequired,
  canEdit: PropTypes.bool.isRequired,
};

export default UserProfilePage;
