import React from 'react';
import PropTypes from 'prop-types';
import { Layout } from 'antd';
import UserProfilePageHeader from 'components/UserProfile/UserProfilePageHeader';
import UserProfilePageContent from 'components/UserProfile/UserProfilePageContent';

const { Header, Footer, Content } = Layout;

const UserProfilePage = ({ profile, onSubmitUpdateProfile, canEdit, loggedInUser }) => {
  return (
    <Layout>
      <Header style={{backgroundColor: 'transparent', minHeight: 250, padding: 0}}>
        <UserProfilePageHeader profile={profile} loggedInUser={loggedInUser} />
      </Header>
      <Content>
        <UserProfilePageContent profile={profile} loggedInUser={loggedInUser} onSubmitUpdateProfile={onSubmitUpdateProfile} canEdit={canEdit}/>
      </Content>
    </Layout>
  );
};

UserProfilePage.propTypes = {
  profile: PropTypes.object.isRequired,
  onSubmitUpdateProfile: PropTypes.func.isRequired,
  canEdit: PropTypes.bool.isRequired,
};

export default UserProfilePage;
