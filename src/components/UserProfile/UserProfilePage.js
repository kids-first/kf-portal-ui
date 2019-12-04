import React from 'react';
import PropTypes from 'prop-types';
import { Layout, Menu } from 'antd';
import AboutMe from './AboutMe';
import HeaderBannerContainer from './HeaderBannerContainer';
import Settings from './Settings';
import './style.css';

const KEY_ABOUT_ME = '#aboutMe';
const KEY_SETTINGS = '#settings';

const { Header, Content, Sider } = Layout;

const ShowOtherUserProfile = ({ canEdit, profile, updateProfileCb, isProfileUpdating }) => {
  return (
    <Layout>
      <Header className={'up-header'}>
        <HeaderBannerContainer canEdit={canEdit} />
      </Header>
      <Layout>
        <Content>
          <AboutMe
            canEdit={canEdit}
            profile={profile}
            updateProfileCb={updateProfileCb}
            isProfileUpdating={isProfileUpdating}
          />
        </Content>
      </Layout>
    </Layout>
  );
};

function UserProfilePage(props) {
  const {
    profile,
    canEdit,
    handleMenuClickCb,
    currentMenuItem,
    updateProfileCb,
    isProfileUpdating,
  } = props;

  if (!canEdit) {
    return (
      <ShowOtherUserProfile
        canEdit={canEdit}
        profile={profile}
        updateProfileCb={updateProfileCb}
        isProfileUpdating={isProfileUpdating}
      />
    );
  }

  const isAboutMeSelected = currentMenuItem === KEY_ABOUT_ME;
  const isSettingsSelected = currentMenuItem === KEY_SETTINGS;

  let contentDisplay = null;
  if (isAboutMeSelected) {
    contentDisplay = (
      <AboutMe
        canEdit={canEdit}
        profile={profile}
        updateProfileCb={updateProfileCb}
        isProfileUpdating={isProfileUpdating}
      />
    );
  } else if (isSettingsSelected) {
    contentDisplay = <Settings userEmail={profile.email} />;
  }

  return (
    <Layout>
      <Header className={'up-header'}>
        <HeaderBannerContainer canEdit={canEdit} />
      </Header>
      <Layout>
        <Sider width={350} className={'up-sider'}>
          <Menu
            mode="inline"
            defaultSelectedKeys={[currentMenuItem]}
            onClick={handleMenuClickCb}
            className={'menu-vertical-offset'}
          >
            <Menu.Item
              key={KEY_ABOUT_ME}
              style={{ backgroundColor: 'inherit' /* remove background when selected*/ }}
            >
              <div className={'up-anchor-wrapper'}>
                <a href="#aboutMe">About Me</a>
              </div>
            </Menu.Item>
            <Menu.Item key={KEY_SETTINGS} style={{ backgroundColor: 'inherit' }}>
              <div className={'up-anchor-wrapper'}>
                <a href="#settings">Settings</a>
              </div>
            </Menu.Item>
          </Menu>
        </Sider>
        <Content>{contentDisplay}</Content>
      </Layout>
    </Layout>
  );
}

UserProfilePage.propTypes = {
  profile: PropTypes.object.isRequired,
  canEdit: PropTypes.bool.isRequired,
  hash: PropTypes.string,
  handleMenuClickCb: PropTypes.func.isRequired,
  currentMenuItem: PropTypes.string.isRequired,
  updateProfileCb: PropTypes.func.isRequired,
  isProfileUpdating: PropTypes.bool.isRequired,
};

export default UserProfilePage;
