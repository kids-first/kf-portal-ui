import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Layout, Menu } from 'antd';
import AboutMe from './AboutMe_new'; //TODO
import HeaderBannerContainer from './HeaderBannerContainer';
import Settings from './Settings_new';

const KEY_ABOUT_ME = 'aboutMe';
const KEY_SETTINGS = 'settings';

const { Header, Content, Sider } = Layout;

class UserProfilePage extends Component {
  static propTypes = {
    profile: PropTypes.object.isRequired,
    onSubmitUpdateProfile: PropTypes.func.isRequired,
    canEdit: PropTypes.bool.isRequired,
  };

  state = {
    currentMenuItem: KEY_ABOUT_ME,
  };

  handleClick = e => {
    this.setState({
      currentMenuItem: e.key,
    });
  };

  render() {
    const { profile, canEdit } = this.props;
    const { currentMenuItem } = this.state;
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
            <Menu mode="inline" defaultSelectedKeys={[KEY_ABOUT_ME]} onClick={this.handleClick}>
              <Menu.Item
                key={KEY_ABOUT_ME}
                style={{ backgroundColor: 'inherit' /* remove background when selected*/ }}
              >
                <div style={{ textAlign: 'right', paddingRight: '10px', fontSize: '24px', paddingBottom: '10px' }}>About Me</div>
              </Menu.Item>
              <Menu.Item key={KEY_SETTINGS} style={{ backgroundColor: 'inherit' }}>
                <div style={{ textAlign: 'right', paddingRight: '10px', fontSize: '24px',  paddingBottom: '10px' }}>Settings </div>
              </Menu.Item>
            </Menu>
          </Sider>
          <Content>
            {currentMenuItem === KEY_ABOUT_ME && <AboutMe canEdit={canEdit} profile={profile} />}
            {currentMenuItem === KEY_SETTINGS && <Settings profile={profile} />}
          </Content>
        </Layout>
      </Layout>
    );
  }
}

export default UserProfilePage;
