import React from 'react';
import PropTypes from 'prop-types';
import { Layout } from 'antd';
import UserProfilePageHeader from 'components/UserProfile/UserProfilePageHeader';

const { Header, Footer, Content } = Layout;

const UserProfilePage = ({ profile, onSummitUpdateProfile, canEdit, loggedInUser }) => {
  return (
    <Layout>
      <Header style={{backgroundColor: 'transparent', minHeight: 330, padding: 0}}>
        <UserProfilePageHeader profile={profile} loggedInUser={loggedInUser}/>
      </Header>
      <Content>
        Content</Content>
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
