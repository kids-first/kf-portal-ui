import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Layout, Menu, Icon } from 'antd';
import UserProfilePageHeader from 'components/UserProfile/UserProfilePageHeader';
import AboutMe from './AboutMe_new'; //TODO
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
        <Header style={{ backgroundColor: 'transparent', minHeight: 250, padding: 0 }}>
          <UserProfilePageHeader profile={profile} />
        </Header>
        <Layout>
          <Sider style={{ background: '#fff' }}>
            <Menu mode="inline" defaultSelectedKeys={[KEY_ABOUT_ME]} onClick={this.handleClick}>
              <Menu.Item key={KEY_ABOUT_ME}>
                <span className="nav-text">About me Todo</span>
              </Menu.Item>
              <Menu.Item key={KEY_SETTINGS}>
                <span className="nav-text">Settings todo </span>
              </Menu.Item>
            </Menu>
          </Sider>
          <Content>
            {currentMenuItem === KEY_ABOUT_ME && <AboutMe canEdit={canEdit} profile={profile} />}
            {currentMenuItem === KEY_SETTINGS && <div>hello settings</div>}
          </Content>
        </Layout>
      </Layout>
    );
  }
}

export default UserProfilePage;
