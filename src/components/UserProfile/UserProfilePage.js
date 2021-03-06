import React from 'react';
import PropTypes from 'prop-types';
import { Layout, Menu } from 'antd';
import AboutMe from './AboutMe';
import HeaderBannerContainer from './HeaderBannerContainer';
import Settings from './Settings';
import './style.css';
import { KEY_ABOUT_ME, KEY_SETTINGS } from './constants';

const { Header, Content, Sider } = Layout;

const ShowOtherUserProfile = ({ profile, updateProfileCb, isProfileUpdating, loggedInUser, isAdmin }) => {
  return (
    <Layout>
      <Header className={'up-header'}>
        <HeaderBannerContainer canEdit={false} isAdmin={isAdmin}/>
      </Header>
      <Layout className={'main-layout'}>
        <Content className={'content-about-me-settings vertical-offset horizontal-offset'}>
          <AboutMe
            canEdit={false}
            profile={profile}
            updateProfileCb={updateProfileCb}
            isProfileUpdating={isProfileUpdating}
            loggedInUser={loggedInUser}
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
    collapsed,
    onBreakPointCb,
    loggedInUser,
    isAdmin,
  } = props;

  if (!canEdit) {
    return (
      <ShowOtherUserProfile
        canEdit={canEdit}
        profile={profile}
        updateProfileCb={updateProfileCb}
        isProfileUpdating={isProfileUpdating}
        loggedInUser={loggedInUser}
        isAdmin={isAdmin}
      />
    );
  }

  const isSettingsSelected = currentMenuItem === KEY_SETTINGS;

  return (
    <Layout>
      <Header className={'up-header'}>
        <HeaderBannerContainer canEdit={canEdit} isAdmin={isAdmin}/>
      </Header>
      <Layout className={'main-layout'}>
        <Sider
          breakpoint="xl"
          width={collapsed ? 100 : 340}
          className={'up-sider'}
          onBreakpoint={onBreakPointCb}
        >
          <Menu
            mode="inline"
            defaultSelectedKeys={[currentMenuItem]}
            onClick={handleMenuClickCb}
            className={'menu-vertical-offset'}
          >
            <Menu.Item
              className={'menu-border-right-override'}
              key={KEY_ABOUT_ME}
              style={{
                backgroundColor: 'inherit' /* remove background when selected*/,
                marginBottom: '32px',
              }}
            >
              <div className={'up-anchor-wrapper'}>
                <a
                  href={KEY_ABOUT_ME}
                  className={`${
                    isSettingsSelected
                      ? 'up-menu-item-when-not-selected'
                      : `up-menu-item-when-selected`
                  } up-menu-item-text`}
                >
                  {'About Me'}
                </a>
              </div>
            </Menu.Item>
            <Menu.Item
              className={'menu-border-right-override'}
              key={KEY_SETTINGS}
              style={{ backgroundColor: 'inherit', marginBottom: '32px' }}
            >
              <div className={'up-anchor-wrapper'}>
                <a
                  href={KEY_SETTINGS}
                  className={`${
                    isSettingsSelected
                      ? 'up-menu-item-when-selected'
                      : `up-menu-item-when-not-selected`
                  } up-menu-item-text`}
                >
                  {'Settings'}
                </a>
              </div>
            </Menu.Item>
          </Menu>
        </Sider>
        <Content className={'content-about-me-settings vertical-offset horizontal-offset'}>
          {isSettingsSelected ? (
            <Settings userEmail={profile.email} />
          ) : (
            <AboutMe
              canEdit={canEdit}
              profile={profile}
              updateProfileCb={updateProfileCb}
              isProfileUpdating={isProfileUpdating}
              loggedInUser={loggedInUser}
            />
          )}
        </Content>
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
  collapsed: PropTypes.bool.isRequired,
  onBreakPointCb: PropTypes.func.isRequired,
  loggedInUser: PropTypes.object.isRequired,
};

export default UserProfilePage;
