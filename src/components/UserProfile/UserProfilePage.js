import React from 'react';
import PropTypes from 'prop-types';
import { Layout, Menu } from 'antd';
import AboutMe from './AboutMe_new'; //TODO
import HeaderBannerContainer from './HeaderBannerContainer';
import Settings from './Settings_new';

const KEY_ABOUT_ME = 'aboutMe';
const KEY_SETTINGS = 'settings';

const { Header, Content, Sider } = Layout;

function UserProfilePage(props) {
  const { profile, canEdit, handleMenuClickCb, currentMenuItem, updateProfileCb } = props;

  const isAboutMeSelected = currentMenuItem === KEY_ABOUT_ME;
  const isSettingsSelected = currentMenuItem === KEY_SETTINGS;

  return (
    <Layout>
      <Header style={{ backgroundColor: 'transparent', height: 240, padding: 0 }}>
        <HeaderBannerContainer canEdit={canEdit} />
      </Header>
      <Layout>
        <Sider
          width={350}
          style={{
            background: '#fff',
            borderRight: '1px solid rgb(237,238,241)',
            paddingTop: '25px',
          }}
        >
          <Menu mode="inline" defaultSelectedKeys={[currentMenuItem]} onClick={handleMenuClickCb}>
            <Menu.Item
              key={KEY_ABOUT_ME}
              style={{ backgroundColor: 'inherit' /* remove background when selected*/ }}
            >
              <div
                style={{
                  textAlign: 'right',
                  paddingRight: '10px',
                  fontSize: '24px',
                  paddingBottom: '10px',
                }}
              >
                <a href="#aboutMe">About Me</a>
              </div>
            </Menu.Item>
            <Menu.Item key={KEY_SETTINGS} style={{ backgroundColor: 'inherit' }}>
              <div
                style={{
                  textAlign: 'right',
                  paddingRight: '10px',
                  fontSize: '24px',
                  paddingBottom: '10px',
                }}
              >
                <a href="#settings">Settings</a>
              </div>
            </Menu.Item>
          </Menu>
        </Sider>
        <Content>
          {isAboutMeSelected && (
            <AboutMe canEdit={canEdit} profile={profile} updateProfileCb={updateProfileCb} />
          )}
          {isSettingsSelected && <Settings userEmail={profile.email} />}
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
};

export default UserProfilePage;
